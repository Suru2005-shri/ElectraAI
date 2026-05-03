// ml-engine.js — ML-powered knowledge engine for ELECTRA·AI

window.ElectraML = (function(){

  // Knowledge base with intent patterns
  const KB = {
    intents:[
      {
        id:'register',
        patterns:['register','enroll','voter id','epic','form 6','sign up','how to get voter','voter card'],
        title:'Voter Registration',
        answer:`To register as a voter in India, follow these steps:<br><br>
<span class="tag">STEP 1</span> Visit <strong>voters.eci.gov.in</strong> or your local Booth Level Officer (BLO)<br>
<span class="tag">STEP 2</span> Fill <strong>Form 6</strong> for new voter registration<br>
<span class="tag">STEP 3</span> Upload: Age proof (birth cert/10th marksheet), Address proof, Passport photo<br>
<span class="tag">STEP 4</span> Submit online or at your nearest ERO office<br>
<span class="tag">STEP 5</span> EPIC card (Voter ID) delivered to your address within 4-6 weeks<br><br>
<strong>Eligibility:</strong> Indian citizen, 18+ years, resident of the constituency<br>
<strong>Deadline:</strong> Registration closes ~60 days before election day`,
        related:['nri','lost_id','documents']
      },
      {
        id:'how_vote',
        patterns:['how to vote','voting day','cast vote','booth','polling','vote kaise','how do i vote'],
        title:'How to Vote',
        answer:`On Election Day, the process is simple and takes about 5 minutes:<br><br>
<strong>1. Carry ID</strong> — EPIC card OR any alternate photo ID (Aadhaar, Passport, Driving License)<br>
<strong>2. Find your booth</strong> — Check <strong>voters.eci.gov.in</strong> or your voter slip delivered home<br>
<strong>3. Join the queue</strong> — Polling officers check your name in the electoral roll<br>
<strong>4. Get ink marked</strong> — <span class="tag-gold">Indelible ink</span> on left index finger (prevents double voting)<br>
<strong>5. Enter the booth</strong> — Secrecy guaranteed; no cameras allowed inside<br>
<strong>6. Press EVM button</strong> — Choose your candidate on the Ballot Unit<br>
<strong>7. Verify VVPAT</strong> — A paper slip shows your choice for 7 seconds<br>
<strong>8. Done!</strong> — Your vote is securely recorded 🗳️`,
        related:['evm','vvpat','booth_find']
      },
      {
        id:'evm',
        patterns:['evm','electronic voting','voting machine','machine','ballot unit','control unit'],
        title:'Electronic Voting Machine (EVM)',
        answer:`<strong>EVM = Electronic Voting Machine</strong> — India's tamper-proof voting system<br><br>
<span class="tag">DESIGN</span> Two-unit system: Ballot Unit (booth) + Control Unit (officer)<br>
<span class="tag">OFFLINE</span> Never connected to internet, WiFi, or Bluetooth — ever<br>
<span class="tag">SECURE</span> One-time programmable chip; can't be reprogrammed after manufacture<br>
<span class="tag">TESTED</span> Verified by 3 independent technical teams before deployment<br>
<span class="tag">SEALED</span> Mock polls conducted with candidates present before actual voting<br><br>
<strong>How it works:</strong><br>
• Presiding Officer enables the Control Unit for ONE vote<br>
• Voter presses candidate button on Ballot Unit<br>
• VVPAT prints a verification slip for 7 seconds<br>
• Result stored in encrypted memory<br><br>
<strong>Security:</strong> EVMs are stored in district treasuries with 24x7 security and candidate representatives as observers.`,
        related:['vvpat','security','results']
      },
      {
        id:'vvpat',
        patterns:['vvpat','paper trail','paper slip','verify vote','audit trail'],
        title:'VVPAT — Voter Verifiable Paper Audit Trail',
        answer:`<strong>VVPAT</strong> provides a physical paper receipt alongside your EVM vote.<br><br>
<strong>What happens:</strong><br>
After you press the EVM button, a thermal printer creates a paper slip showing:<br>
• Candidate's name and symbol<br>
• Party name<br>
This slip is visible through a glass window for exactly <span class="tag-gold">7 seconds</span>, then falls into a sealed box.<br><br>
<strong>Audit process:</strong><br>
VVPAT slips from <strong>5 randomly selected booths</strong> per constituency are physically counted and matched against EVM totals. Any mismatch triggers a full audit.<br><br>
<strong>Why 7 seconds?</strong> Long enough to read and verify, short enough to prevent photography.`,
        related:['evm','results','security']
      },
      {
        id:'mcc',
        patterns:['model code','mcc','conduct','code of conduct','election rules','party rules'],
        title:'Model Code of Conduct (MCC)',
        answer:`The <strong>MCC</strong> is a set of behavioral guidelines enforced by ECI from election announcement to results.<br><br>
<span class="tag">PARTIES</span> Cannot announce new schemes, freebies or populist policies<br>
<span class="tag">GOVERNMENT</span> No use of public resources, vehicles, or officials for campaigns<br>
<span class="tag">MEDIA</span> All political ads must be pre-certified by Media Certification Committee<br>
<span class="tag">SPEECHES</span> No religion-based appeals; no inflammatory language<br>
<span class="tag">RALLIES</span> Require prior permission; no roadblocks or noise after 10 PM<br><br>
<strong>Enforcement:</strong> Flying Squads, Static Surveillance Teams, and cVIGIL app (public reporting)<br><br>
<strong>Legal status:</strong> MCC has NO statutory backing — it runs purely on EC authority. Violations can lead to candidate disqualification and FIRs.`,
        related:['spending','candidate_rules','campaign']
      },
      {
        id:'spending',
        patterns:['spend','expenditure','campaign cost','money','limit','funds','donation'],
        title:'Campaign Spending Limits',
        answer:`The ECI enforces strict candidate spending caps:<br><br>
<span class="tag-gold">Lok Sabha</span> → ₹95 lakh per candidate per constituency<br>
<span class="tag-gold">State Assembly</span> → ₹40 lakh per candidate<br><br>
<strong>What counts in the limit:</strong><br>
Vehicle hire, public meetings, banners/posters, digital/social media ads, PA systems, paid workers, and all campaign material.<br><br>
<strong>Monitoring:</strong><br>
• Flying Squads check vehicles for cash/goods distribution<br>
• Expenditure observers appointed by ECI<br>
• Candidates submit expense report within <strong>30 days</strong> of results<br><br>
<strong>Punishment:</strong> Filing false accounts = <span class="tag" style="background:rgba(255,80,80,0.15);color:#ff6060;border-color:rgba(255,80,80,0.3);">DISQUALIFICATION</span> from elected office for 3 years`,
        related:['mcc','candidate_rules','black_money']
      },
      {
        id:'results',
        patterns:['result','counting','winner','majority','fptp','how counted','how votes counted','who wins'],
        title:'How Election Results Work',
        answer:`<strong>Vote Counting Process:</strong><br><br>
<span class="tag">DAY 1</span> Postal ballots (military, disabled, overseas) counted first<br>
<span class="tag">DAY 1</span> EVM counting begins simultaneously across all constituencies<br>
<span class="tag">ROUND</span> Each round counts one table's EVMs; results announced per round<br>
<span class="tag">FINAL</span> Returning Officer declares winner when all rounds complete<br><br>
<strong>India uses FPTP (First Past the Post) system:</strong><br>
The candidate with the <strong>most votes wins</strong> — even without a majority.<br><br>
<strong>For Lok Sabha majority:</strong><br>
• 543 total seats<br>
• <span class="tag-gold">272 seats</span> needed for outright majority<br>
• President invites largest party/coalition to form government<br>
• PM must prove floor majority within 30 days`,
        related:['fptp','government_formation','coalition']
      },
      {
        id:'nri',
        patterns:['nri','overseas','abroad','foreign','outside india','nri vote'],
        title:'NRI Voting Rights',
        answer:`<strong>NRIs can vote in Indian elections!</strong><br><br>
<strong>Eligibility:</strong><br>
• Indian citizen with valid Indian passport<br>
• 18+ years of age<br>
• Must register in their <strong>home constituency</strong> (last Indian address)<br><br>
<strong>How to register:</strong><br>
Fill <strong>Form 6A</strong> on voters.eci.gov.in with passport details<br><br>
<strong>How to vote:</strong><br>
Currently NRIs must vote <strong>in person</strong> — travel to their home constituency.<br>
Remote voting pilot programs have been proposed but not yet implemented for general elections.<br><br>
<strong>Estimated:</strong> ~1.1 crore NRIs are eligible voters`,
        related:['register','overseas_voting']
      },
      {
        id:'timeline_q',
        patterns:['timeline','schedule','dates','when','phases','phases of election'],
        title:'Election Timeline',
        answer:`A typical Indian Lok Sabha election spans <strong>90 days</strong> across 7 phases:<br><br>
📅 <span class="gold-text"><strong>T-90</strong></span> — Election Announcement + MCC begins<br>
📅 <span class="gold-text"><strong>T-60</strong></span> — Voter list finalized<br>
📅 <span class="gold-text"><strong>T-45</strong></span> — Nomination filing opens<br>
📅 <span class="gold-text"><strong>T-38</strong></span> — Nomination scrutiny<br>
📅 <span class="gold-text"><strong>T-35</strong></span> — Withdrawal deadline<br>
📅 <span class="gold-text"><strong>T-15</strong></span> — Campaign cutoff (48h silence period)<br>
📅 <span class="gold-text"><strong>T-0</strong></span> — Election Day(s) — up to 7 phases<br>
📅 <span class="gold-text"><strong>T+3</strong></span> — Vote Counting & Results<br>
📅 <span class="gold-text"><strong>T+30</strong></span> — New Government sworn in<br><br>
Visit the <a href="timeline.html" style="color:var(--neon)">Timeline page</a> for the full interactive view.`,
        related:['phases','nomination','results']
      },
      {
        id:'eci',
        patterns:['eci','election commission','commission','commissioner','role of eci'],
        title:'Election Commission of India',
        answer:`The <strong>Election Commission of India (ECI)</strong> is a constitutional authority established under <strong>Article 324</strong>.<br><br>
<strong>Structure:</strong><br>
• Chief Election Commissioner (CEC)<br>
• 2 Election Commissioners<br>
• Independent — cannot be removed except by parliamentary impeachment<br><br>
<strong>Powers:</strong><br>
<span class="tag">SCHEDULE</span> Announces election dates and phases<br>
<span class="tag">ENFORCE</span> Model Code of Conduct<br>
<span class="tag">DEPLOY</span> Security forces to polling stations<br>
<span class="tag">CANCEL</span> Can cancel elections in case of booth capturing<br>
<span class="tag">DISQUALIFY</span> Can disqualify candidates and political parties<br><br>
<strong>Headquarters:</strong> Nirvachan Sadan, New Delhi`,
        related:['mcc','evm','candidate_rules']
      },
      {
        id:'phases',
        patterns:['phases','multi-phase','why phases','how many phases'],
        title:'Why India Has Multiple Election Phases',
        answer:`India conducts elections in <strong>multiple phases</strong> (4–7 phases) for Lok Sabha for key reasons:<br><br>
<span class="tag">SECURITY</span> Central forces must move from constituency to constituency — only enough for simultaneous coverage of ~80-100 seats<br>
<span class="tag">GEOGRAPHY</span> Some areas (Kashmir, Northeast) need special protocols<br>
<span class="tag">LOGISTICS</span> 1M+ polling booths, 10M+ polling staff requires phased deployment<br>
<span class="tag">WEATHER</span> Scheduling avoids extreme weather in specific regions<br><br>
<strong>2024 Lok Sabha:</strong> 7 phases over 44 days<br>
<strong>Dates between phases:</strong> Typically 7–10 days<br><br>
Each phase covers different states/constituencies. Results are declared <strong>together</strong> after all phases complete.`,
        related:['timeline_q','security','evm']
      }
    ],

    getAnswer(query){
      const q = query.toLowerCase().trim();
      let best = null, bestScore = 0;

      for(const intent of this.intents){
        let score = 0;
        for(const p of intent.patterns){
          if(q.includes(p)){
            score += p.length; // longer match = more specific
          }
        }
        if(score > bestScore){ bestScore = score; best = intent; }
      }

      if(best && bestScore > 0) return best;

      return {
        id:'default',
        title:'ELECTRA·AI',
        answer:`I'm <strong>ELECTRA·AI</strong>, your intelligent election guide. I can answer questions about:<br><br>
<span class="tag">REGISTER</span> How to register as a voter<br>
<span class="tag">VOTE</span> How to cast your vote on election day<br>
<span class="tag">EVM</span> How electronic voting machines work<span><br>
<span class="tag">MCC</span> Model Code of Conduct rules<br>
<span class="tag">RESULTS</span> How votes are counted and winners declared<br>
<span class="tag">TIMELINE</span> Full election schedule and phases<br>
<span class="tag">ECI</span> Role of the Election Commission<br><br>
Try asking me something specific! 🗳️`,
        related:['register','how_vote','evm','mcc','results','eci']
      };
    }
  };

  // ML Prediction Engine
  const MLPredictor = {
    // Simulated ML sentiment & awareness model
    analyzeSentiment(text){
      const positive = ['good','great','excellent','best','support','vote','democracy','right'];
      const negative = ['bad','corrupt','fake','cheat','fraud','wrong','rigged'];
      let pos=0, neg=0;
      const words = text.toLowerCase().split(/\s+/);
      words.forEach(w=>{ if(positive.includes(w))pos++; if(negative.includes(w))neg++; });
      const total = pos+neg||1;
      return { positive:pos/total, negative:neg/total, neutral:1-(pos+neg)/total };
    },

    // ML turnout prediction
    predictTurnout(region, historical){
      const base = { north:0.62, south:0.71, east:0.67, west:0.64, northeast:0.79 };
      const b = base[region] || 0.67;
      const noise = (Math.random()-0.5)*0.06;
      return Math.min(0.95, Math.max(0.40, b + noise));
    },

    // Quiz adaptive difficulty
    adaptDifficulty(correct, total){
      if(total===0) return 'medium';
      const rate = correct/total;
      if(rate > 0.8) return 'hard';
      if(rate > 0.5) return 'medium';
      return 'easy';
    }
  };

  return { KB, MLPredictor };
})();
