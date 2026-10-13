(() => {
const questions = [
  {id:'financial_history',q:'How well can you document the last 2–3 years of business performance?',options:[
    ['strong','Tax returns, P&Ls and collection/deposit records mostly reconcile'],
    ['partial','I have some records, but there are gaps or mismatches'],
    ['weak','I cannot clearly support the reported earnings'],
    ['unknown','I am not sure']
  ]},
  {id:'revenue_verification',q:'Can your reported revenue be cross-checked against independent records?',options:[
    ['strong','Yes — payment/collection records and utilities broadly support it'],
    ['partial','Some of it can be verified, but not consistently'],
    ['weak','No — much of the revenue would be difficult to prove'],
    ['unknown','I am not sure']
  ]},
  {id:'lease_years',q:'Including renewal options you control, how much usable lease runway do you have?',options:[
    ['long','10+ years'],
    ['medium','5–9 years'],
    ['short','Under 5 years'],
    ['unknown','I am not sure']
  ]},
  {id:'lease_transfer',q:'Can the lease be assigned or transferred to a buyer?',options:[
    ['yes','Yes, or landlord consent is clearly available'],
    ['conditional','It needs landlord approval or has conditions'],
    ['no','No, or there is a known transfer problem'],
    ['unknown','I am not sure']
  ]},
  {id:'rent_ratio',q:'About what percentage of annual collections goes to base rent plus recurring occupancy charges?',options:[
    ['healthy','15% or less'],
    ['watch','16%–22%'],
    ['high','More than 22%'],
    ['unknown','I am not sure']
  ]},
  {id:'equipment_age',q:'What best describes the age and replacement risk of the core washer/dryer fleet?',options:[
    ['newer','Mostly under 8 years, with no major replacement wave near'],
    ['midlife','Mostly 8–15 years, maintained and operating'],
    ['old','A large share is over 15 years or major replacement is near'],
    ['unknown','I am not sure']
  ]},
  {id:'deferred_maintenance',q:'Is there material deferred maintenance or important equipment currently out of service?',options:[
    ['no','No material deferred work'],
    ['some','Some repairs or replacements should be handled'],
    ['major','Yes — material repairs/replacement are pending'],
    ['unknown','I am not sure']
  ]},
  {id:'owner_dependence',q:'Could another operator take over the store without depending heavily on you?',options:[
    ['transferable','Yes — routines, vendors and staffing are documented or straightforward'],
    ['some','Mostly, but I still handle important recurring tasks'],
    ['dependent','No — the operation relies heavily on me personally'],
    ['unknown','I am not sure']
  ]},
  {id:'trend',q:'What has happened to collections over roughly the last 12 months?',options:[
    ['up','Up or stable'],
    ['slight_down','Down modestly'],
    ['down','Down materially'],
    ['unknown','I am not sure']
  ]},
  {id:'timing',q:'When would you ideally like to exit?',options:[
    ['soon','Within 6 months'],
    ['year','6–12 months'],
    ['later','More than 12 months'],
    ['exploring','I am only exploring']
  ]}
];

const issues = {
  financial_history:{
    weak:{severity:3,title:'Financial proof',reason:'Your reported earnings may be difficult for a buyer or lender to verify.',action:'Rebuild clean, supportable SDE using tax returns, P&Ls, deposits and collection records before going to market.'},
    partial:{severity:2,title:'Financial proof',reason:'Gaps or mismatches in the financial record can create diligence friction.',action:'Reconcile the last 2–3 years of financial and collection records before listing.'},
    unknown:{severity:2,title:'Financial proof',reason:'You do not yet know whether the earnings can be supported.',action:'Confirm what records exist before relying on a sale price.'}
  },
  revenue_verification:{
    weak:{severity:3,title:'Revenue verification',reason:'Revenue that cannot be corroborated may be discounted or rejected in diligence.',action:'Tie collections to payment records, deposits and utility usage before marketing the business.'},
    partial:{severity:2,title:'Revenue verification',reason:'Only part of the revenue story is independently verifiable.',action:'Close the verification gaps before asking a buyer to pay a multiple on those earnings.'},
    unknown:{severity:2,title:'Revenue verification',reason:'Revenue verification is still unclear.',action:'Check card/coin records, deposits and utility history.'}
  },
  lease_years:{
    short:{severity:3,title:'Lease runway',reason:'Under five years of controllable lease runway can scare buyers and constrain financing.',action:'Talk to the landlord about an extension or additional options before listing.'},
    medium:{severity:1,title:'Lease runway',reason:'Five to nine years is workable, but buyers will still examine options and financing horizon.',action:'Document every renewal option and transfer condition clearly.'},
    unknown:{severity:3,title:'Lease runway',reason:'The remaining controllable lease term is unknown.',action:'Read the lease and all amendments before entering a sale process.'}
  },
  lease_transfer:{
    no:{severity:3,title:'Lease transfer',reason:'A known transfer problem can block a location-dependent laundromat sale.',action:'Resolve assignability or landlord-consent issues before marketing the business.'},
    conditional:{severity:2,title:'Lease transfer',reason:'The buyer may depend on landlord approval or other transfer conditions.',action:'Clarify the transfer process and landlord requirements before you list.'},
    unknown:{severity:3,title:'Lease transfer',reason:'You do not yet know whether a buyer can take over the lease.',action:'Confirm assignability, consent requirements and amendments.'}
  },
  rent_ratio:{
    high:{severity:2,title:'Occupancy cost',reason:'Occupancy above the low-20s percent of collections can squeeze cash flow and value.',action:'Verify the full occupancy burden and be ready to explain it to buyers.'},
    watch:{severity:1,title:'Occupancy cost',reason:'Rent is within a range buyers will examine closely.',action:'Document rent, CAM and scheduled escalations clearly.'},
    unknown:{severity:1,title:'Occupancy cost',reason:'Your occupancy burden is not yet clear.',action:'Calculate base rent plus recurring occupancy charges as a share of collections.'}
  },
  equipment_age:{
    old:{severity:2,title:'Equipment replacement risk',reason:'A fleet beyond common commercial washer life can create near-term capital needs.',action:'Build a machine inventory with age, condition and realistic replacement cost before listing.'},
    midlife:{severity:1,title:'Equipment replacement risk',reason:'Midlife machines make service history and replacement planning important.',action:'Prepare service records and a realistic replacement schedule.'},
    unknown:{severity:1,title:'Equipment replacement risk',reason:'Equipment age is not yet documented.',action:'Create a machine-by-machine inventory and service history.'}
  },
  deferred_maintenance:{
    major:{severity:3,title:'Deferred maintenance',reason:'Material deferred repairs can become an immediate price reduction in diligence.',action:'Price the repair/replacement exposure and fix obvious failures before listing.'},
    some:{severity:1,title:'Deferred maintenance',reason:'Some visible repair needs can weaken buyer confidence.',action:'Resolve obvious failures and document what remains.'},
    unknown:{severity:1,title:'Deferred maintenance',reason:'Maintenance exposure is unclear.',action:'Inspect the machines, water heating, plumbing and other major systems.'}
  },
  owner_dependence:{
    dependent:{severity:2,title:'Owner dependence',reason:'A buyer may discount a store that depends heavily on the current owner.',action:'Document recurring tasks, vendors, staffing and operating routines so another operator can take over.'},
    some:{severity:1,title:'Owner dependence',reason:'Some recurring work still depends on you.',action:'Document the tasks a buyer would inherit and reduce avoidable owner-only knowledge.'},
    unknown:{severity:1,title:'Owner dependence',reason:'Transferability is not yet clear.',action:'Map the tasks that only you currently know or perform.'}
  },
  trend:{
    down:{severity:2,title:'Recent performance',reason:'A material decline in collections will draw buyer questions and can reduce confidence.',action:'Understand and document the cause before choosing your sale timing.'},
    slight_down:{severity:1,title:'Recent performance',reason:'A modest decline is likely to need explanation.',action:'Prepare a clear explanation using monthly collections and operating context.'},
    unknown:{severity:1,title:'Recent performance',reason:'The recent trend is not yet clear.',action:'Compare trailing monthly collections before you set a sale plan.'}
  }
};

function evaluate(answers){
  const found=[];
  for(const [id,value] of Object.entries(answers)){
    const issue=issues[id]?.[value];
    if(issue) found.push({...issue,id});
  }
  found.sort((a,b)=>b.severity-a.severity);
  const critical=found.filter(x=>x.severity>=3);
  const medium=found.filter(x=>x.severity===2);
  const unknownCritical=['financial_history','revenue_verification','lease_years','lease_transfer'].some(id=>answers[id]==='unknown');
  let type,title,summary;
  if(unknownCritical){
    type='need_info'; title='Get the missing information first.';
    summary='A critical part of the sale story is still unknown. Confirm it before choosing a broker, buyer or asking price.';
  }else if(critical.length || medium.length>=2){
    type='prepare_first'; title='Prepare first.';
    summary='There is at least one issue worth addressing before you put the laundromat into a sale process.';
  }else{
    type='ready'; title='Ready to explore a sale.';
    summary='This check did not find an obvious preparation blocker. A buyer will still verify the financials, lease, equipment and operations.';
  }
  const top=found[0]||{title:'No obvious blocker surfaced',reason:'The check did not identify a major preparation issue.',action:'Prepare your documentation and compare sale routes before choosing one.'};
  return {type,title,summary,top,reasons:found.slice(0,5)};
}
window.LaundromatExitReadiness={questions,evaluate};
})();