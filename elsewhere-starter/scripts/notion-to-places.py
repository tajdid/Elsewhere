# Convert the owner's Notion list (WFH in Dubai) into src/data/places.json. Facts are copied, never guessed:
# missing fields stay null/unknown and the UI shows a placeholder. Guest Wi-Fi passwords are kept (owner's request).
import json, re, sys
raw = json.load(open(sys.argv[1]))
TYPE = {'Cafe':'Café','Co-working':'Co-working','Restaurant':'Restaurant','Bar':'Bar'}
# Areas only where the list itself names them (in the title, directions, notes or website).
AREA = {
 'A4 Space':'Al Quoz','Techarc':'Al Quoz',
 'Coffee Club - Bluewater Island':'Bluewater Island','Coffee Club - Marina Mall':'Dubai Marina',
 'Coffee Island - Nakhell Mall Palm':'Palm Jumeirah','Jones The Grocer - The Palm':'Palm Jumeirah','La Ramona Dal 1947':'Palm Jumeirah','Fairmont Palm':'Palm Jumeirah',
 'Coffee Planet - Circle Mall JVC':'JVC','Circle Mall':'JVC','One Life DXB - Hive JVC':'JVC',
 'Common Grounds - Dubai Hills Mall':'Dubai Hills','Starbucks Reserve - Dubai Hills Mall':'Dubai Hills',
 'Costa Coffee - Index DIFC':'DIFC','HAVE':'DIFC',
 'Costa Coffee JLT':'JLT','Friends Avenue JLT':'JLT',"Mcgettigan's JLT":'JLT',
 'Doubletree JBR':'JBR','Encounter Coffee - MoE':'Al Barsha','Panifico Media City':'Dubai Media City',
 'Rove Marina':'Dubai Marina','Starbucks - Marina Walk':'Dubai Marina','Social House - Dubai Mall':'Downtown Dubai',
}
SOCKETS = {1:'A few sockets.',2:'Some sockets.',3:'A fair number of sockets.',4:'Plenty of sockets.',5:'Sockets at most seats.'}
NOISE = {'Quiet':'quiet','Moderate':'moderate','Loud':'loud'}
slugify = lambda s: re.sub(r'[^a-z0-9]+','-',s.lower().replace('&','and').replace("'",'')).strip('-')
out=[]
for r in raw:
    added=r['created']; src='Elsewhere visit' if r['visited'] else 'Elsewhere list'
    tags=[TYPE[t] for t in r['tags']]
    noise=NOISE.get(r['noise']) if r['noise'] else None
    pw=r['password'].strip().lower()
    access='unknown' if not pw else 'open' if pw=='no password' else 'signup' if pw=='sign up' else 'password'
    has_wifi = r['speed'] is not None or access!='unknown'
    ev=lambda value,status,note: {'value':value,'status':status,'source':None if status=='unknown' else src,'checkedAt':None if status=='unknown' else added,'note':note}
    unknown=ev('unknown','unknown','Not added yet.')
    wifi = ev('yes','reported','Wi-Fi listed when the place was added.') if has_wifi else unknown
    if r['name']=='Starbucks - Marina Walk': wifi=ev('yes','reported','A network exists but was too slow to use.')
    power = ev('yes','reported',SOCKETS[r['sockets']]) if r['sockets'] else unknown
    calls = {'quiet':ev('yes','reported','Quiet: good for calls.'),'moderate':ev('yes','reported','Some background noise: okay for calls.'),'loud':ev('no','reported','Loud: not great for calls.')}.get(noise,unknown)
    modes=[]
    if 'Co-working' in tags: modes += ['Focus','Together']
    if noise=='quiet': modes += ['Focus','Meetings']
    if noise=='moderate': modes += ['Casual','Meetings']
    if noise=='loud': modes += ['Casual','Together']
    modes=list(dict.fromkeys(modes))
    d=r['directions'].strip()
    maps = d if d.startswith('http') else None
    entry={'Free entry':'free','Paid entry':'paid'}.get(r['entry'])
    out.append({
     'id':slugify(r['name']),'slug':slugify(r['name']),'name':r['name'],'isSample':False,
     'category':tags[0] if tags else None,'tags':tags,'neighbourhood':AREA.get(r['name'],''),
     'summary':r['notes'],'image':None,'imageAlt':None,'imageCredit':None,  # temporary photos are assigned afterwards (see docs/SOURCES.md)
     'sockets':r['sockets'],'noise':noise,'entry':entry,'mapsUrl':maps,'locationNote':None if (not d or maps) else d,
     'menuUrl':r['menu'] or None,'visited':r['visited'],'addedAt':added,
     'modes':modes,
     'priceNote':'Free entry' if entry=='free' else 'Paid entry' if entry=='paid' else 'Entry and prices not added yet.',
     'hoursNote':'Hours not added yet. Check with the venue before you go.',
     'policyNote':'Check laptop use with staff on arrival; busy periods may differ.',
     'address':None,'coordinates':None,'website':r['website'] or None,
     'amenities':{'wifi':wifi,'power':power,'laptops':unknown,'calls':calls,'stepFree':unknown},
     'wifiSpeed':{'downMbps':r['speed'],'upMbps':None,'measuredAt':added,'source':src} if r['speed'] is not None else None,
     'wifiAccess':{'value':access,'password':None,'source':None,'checkedAt':None} if access=='unknown' else {'value':access,'password':r['password'].strip() if access=='password' and pw!='ask server' else None,'source':src,'checkedAt':added},
     'hours':None,
    })
out.sort(key=lambda p:p['name'].lower())
assert len({p['id'] for p in out})==len(out)
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False,indent=2); open(sys.argv[2],'a').write('\n')
print(len(out),'places;',sum(1 for p in out if p['neighbourhood']),'with area;',sum(1 for p in out if p['mapsUrl']),'with map links')
