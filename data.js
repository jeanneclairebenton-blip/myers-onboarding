// data.js — All structured data for Myers Onboarding
window.MYERS_DATA = {
  PHASES: [
    {
      id: 'profile',
      num: '01',
      title: 'Your Profile',
      subtitle: 'Tell us who you are',
      description: 'Upload your headshot and confirm your details. This information auto-populates every template, business card, and email signature in the system.',
      isProfile: true,
      tasks: [
        { id: 'profile-done', title: 'Confirm profile', desc: 'Review and confirm your name, title, photo, and contact info.', icon: 'badge' },
        { id: 'disc-score', title: 'DISC Assessment', desc: 'Complete your DISC personality assessment through Wizehire. This helps us understand your communication and working style.', icon: 'sparkle', optional: true,
          links: [{ label: 'Start Exam', href: 'https://wizehire.com/team/assessment/myers-home-buyers-1' }] },
      ],
    },
    {
      id: 'paperwork',
      num: '02',
      title: 'Paperwork',
      subtitle: 'Sign your agreements',
      description: 'After filling out the online application form, you will automatically receive three documents via email. Please ensure all three are fully completed before proceeding. Once completed, notify Jeanne via text at 337-258-1093.',
      tasks: [
        { id: 'sponsorship', title: 'Sponsorship Agreement', desc: 'This outlines your official affiliation with Myers and your working relationship.', icon: 'signature', image: 'assets/pptx/image1.png' },
        { id: 'w9', title: 'W-9 Form', desc: 'Required for tax purposes as an independent contractor.', icon: 'receipt', image: 'assets/pptx/image10.png' },
        { id: 'cc-auth', title: 'Membership Dues ($150/mo)', desc: 'Covers essential tools and services. If your credit card is declined, failure to update payment will result in an additional $100 fee.', icon: 'creditcard',
          links: [{ label: 'Update Payment Method', href: 'https://buy.stripe.com/fZudR2aR37Y92C87Ue5AQ00' }], image: 'assets/pptx/image2.png' },
      ],
    },
    {
      id: 'licensing',
      num: '03',
      title: '01 & 02: Licensing',
      subtitle: 'Transfer your license',
      description: 'Move your real estate license to Myers via TREC and get your MLS access set up through MetroTex.',
      tasks: [
        { id: 'trec-transfer', title: 'TREC License Transfer', desc: 'You cannot access MLS until your license is active. Follow the official TREC Step-by-Step Guide. Need help? Call 512.936.3000 or email realportal@trec.texas.gov.', icon: 'key',
          links: [{ label: 'TREC Portal', href: 'https://aca-prod.accela.com/TREC/Default.aspx' }] },
        { id: 'mls-access', title: 'Association / MetroTex / MLS', desc: 'To access MLS, you must join a local Realtor Association that feeds into NTREIS. Register with Collin County Association of Realtors via mymetrotex.com. For registration help, call Collin County Area REALTORS®: (972) 618-3800', icon: 'home',
          links: [{ label: 'Fill Out Form', href: 'https://forms.metrotex.com/97c3ba26-f01e-11ef-9c1d-12264f22cfd5' }] },
        { id: 'supra-access', title: 'Add Supra Key Access', desc: 'Go to portal.metrotex.com/home. Menu → Subscriptions → Subscription Actions → Add New Subscriptions → Supra Key Access', icon: 'key', optional: true,
          links: [{ label: 'MetroTex Portal', href: 'http://portal.metrotex.com/home' }] },
      ],
    },
    {
      id: 'comms',
      num: '04',
      title: 'Email, Drives & Calendars',
      subtitle: 'Get connected',
      description: 'Set up your email, shared drives, calendars, and team communication so you never miss a beat.',
      tasks: [
        { id: 'gmail-setup', title: 'Activate Gmail', desc: 'Set up your Myers email account. You will receive login credentials separately.', icon: 'mail', accent: '#D93025' },
        { id: 'calendars', title: 'Join Shared Calendars', desc: 'Subscribe to the Company Calendar and the Myers DFW Showings Calendar to stay updated on all events and property showings.', icon: 'calendar', accent: '#2E5C8A',
          links: [{ label: 'Company Calendar', href: 'https://calendar.google.com/calendar/u/0?cid=Y183cG8ydWpwdDJwM2JqNm5sczYzNXE4MW9vZ0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t' }, { label: 'Myers DFW Showings', href: 'https://calendar.google.com/calendar/u/0?cid=am9zaGRlc2hvbmcuY29tX2QwMXNzMmdwZ2VlZXQxZ3F1Y2pkZDJnNmhvQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20' }] },
        { id: 'shared-drives', title: 'Join Shared Drives', desc: 'Access Myers Deals, Agent Resources, and Marketing Drive.', icon: 'folder', accent: '#C9941F',
          links: [{ label: 'Myers Deals', href: 'https://drive.google.com/drive/folders/0AAKvoVvYPEK-Uk9PVA' }, { label: 'Agent Resources', href: 'https://drive.google.com/drive/folders/0ADyroRsH9CCZUk9PVA' }, { label: 'Marketing Drive', href: 'https://drive.google.com/drive/u/0/folders/11Wo44zwGzuZUL18kfltUjxN-DAuqtiPl' }] },
        { id: 'slack', title: 'Join Slack', desc: 'Download the Slack app on laptop and mobile. Join #myers and #askmeanything2026. In Slack, check the "Resource Hub" channel for offer submission links and key team resources. Mandatory: Add your phone number to your profile and turn ON notifications!', icon: 'chat', accent: '#6B4E8E',
          links: [{ label: 'Open Slack', href: 'https://myershomebuyers.slack.com' }], image: 'assets/pptx/image15.png' },
      ],
    },
    {
      id: 'tools',
      num: '05',
      title: 'Tools & Safety',
      subtitle: 'Get your systems running',
      description: 'Set up your CRM, contracts, and safety tools so you can start working deals immediately.',
      tasks: [
        { id: 'zoho-crm', title: 'Zoho CRM', desc: 'Your lead management and deal pipeline system. Log in to Zoho to access your CRM dashboard, submit offers, and manage your deal pipeline.', icon: 'folder', accent: '#2E5C8A',
          links: [{ label: 'Sign In to Zoho', href: 'https://accounts.zoho.com/signin' }] },
        { id: 'zip-forms', title: 'Zip Forms', desc: '1. Log in to NTREIS. 2. Scroll to the bottom and click "ZipForms". 3. Find your NRDS # in the Member Portal. 4. Call ZipForms Support to activate: 1-800-874-6500. Note: You need your NRDS number to activate your account.', icon: 'doc', accent: '#4F7A3A',
          links: [{ label: 'NTREIS Portal', href: 'http://ntreis.clareity.net' }] },
        { id: 'forewarn', title: 'ForeWarn', desc: 'Log in to NTREIS to access the portal. Scroll to the bottom and click "ForeWarn." Sign up online or call (855) 518-0897 (you will need your License # and Email Address). ⚠️ DISCLAIMER: Do not exceed 200 searches per day or your account will be banned.', icon: 'shield', accent: '#B0432A',
          links: [{ label: 'NTREIS Portal', href: 'http://ntreis.clareity.net' }] },
      ],
    },
    {
      id: 'brand',
      num: '06',
      title: 'Marketing & Brand',
      subtitle: 'Build your presence',
      description: 'Launch your professional brand. Create your announcement post, set up your email signature, order business cards, and get your website live.',
      isMarketing: true,
      tasks: [
        { id: 'brand-guidelines', title: 'Brand Guidelines & Logos', desc: 'Review the brand guidelines and download official logos to use in your own marketing materials.', icon: 'badge', accent: '#C9941F',
          links: [{ label: 'Brand Guidelines', href: 'https://drive.google.com/drive/u/0/folders/11Wo44zwGzuZUL18kfltUjxN-DAuqtiPl' }, { label: 'Logos', href: 'https://drive.google.com/drive/u/0/folders/11Wo44zwGzuZUL18kfltUjxN-DAuqtiPl' }] },
        { id: 'welcome-post', title: 'Welcome Announcement', desc: 'Pick a template, add your headshot, download, and post to social media. Six premium designs available.', icon: 'sparkle', action: 'welcome-post' },
        { id: 'email-sig', title: 'Email Signature', desc: 'Build a branded Gmail signature with your photo, title, and license number.', icon: 'mail', optional: true,
          links: [{ label: 'Email Signature Template', href: 'https://docs.google.com/document/d/1qV6U8BreAibCf9zOdojKk883DguaA5SVUkgR4ixPETk/edit?tab=t.0' }] },
        { id: 'cards', title: 'Business Cards', desc: 'Choose a layout, preview front and back, and order 250 soft-touch matte cards.', icon: 'doc', action: 'cards' },
        { id: 'website', title: 'Carrot Website', desc: 'Launch your free IDX investor site through our Carrot partnership.', icon: 'external', action: 'website' },
        { id: 'social-kit', title: 'Social Brand Kit', desc: 'Download logos, fonts, palette, story templates, and listing flyers.', icon: 'download', action: 'social', optional: true },
      ],
    },
    {
      id: 'closing',
      num: '07',
      title: 'Payout Process',
      subtitle: 'How you get paid',
      description: 'Review the commission payout schedules, funding deadlines, and expedited payout options.',
      tasks: [
        { id: 'payout-review', title: 'Review Payout Policies', desc: 'Read through the commission payout timeline, rules, and expedited payout options.', icon: 'doc', action: 'payout-process' }
      ],
    },
  ],

  TEAM: [
    { id: 'josh', name: 'Josh DeShong', initials: 'JD', role: 'CEO & Partner', bio: 'Founder and partner. Josh built Myers to help agents think like investors, not salespeople. He oversees strategy, brokerage operations, and deal quality.', email: 'josh@myershomebuyers.com' },
    { id: 'stephen', name: 'Stephen Chiang', initials: 'SC', role: 'CIO & Partner', bio: 'Chief Information Officer and partner. Stephen manages technology, systems integration, and data-driven strategy across the brokerage.', email: 's@trelly.com' },
    { id: 'jt', name: 'JT Prather', initials: 'JT', role: 'Team Lead & Partner', bio: 'Team lead and partner. JT works directly with agents on acquisitions, deal flow, and day-to-day coaching across DFW.', email: 'jt@myershomebuyers.com' },
    { id: 'jeanne', name: 'Jeanne Benton', initials: 'JB', role: 'Operations Manager', bio: 'Manages agent onboarding, marketing systems, and daily operations. Your main point of contact for anything from tech issues to deal questions.', email: 'jeanne@myershomebuyers.com' },
    { id: 'julia', name: 'Julia Kasindi', initials: 'JK', role: 'Broker', bio: 'Licensed broker overseeing compliance, agent sponsorship, and regulatory requirements for Myers Home Buyers.', email: 'julia@trelly.com' },
    { id: 'michael', name: 'Michael Demott', initials: 'MD', role: 'Accountant', bio: 'Handles all financial operations including agent commissions, bookkeeping, and payment processing.', email: 'mdemott@trelly.com' },
  ],

  WELCOME_POSTS: [
    { id: 'serif-large', name: 'Editorial', style: 'serif-large', bg: '#1A1815', fg: '#FAF7F0', accent: '#C9941F', sub: '{NAME} just joined Myers Home Buyers as an investment specialist in DFW.' },
    { id: 'serif-mixed', name: 'Headline', style: 'serif-mixed', bg: '#FAF7F0', fg: '#1A1815', accent: '#C9941F', sub: '{NAME} is now licensed under Myers — where agents become investors.' },
    { id: 'photo-first', name: 'Photo First', style: 'photo-first', bg: '#FAF7F0', fg: '#1A1815', accent: '#C9941F', sub: 'Your new agent in DFW investor real estate.' },
    { id: 'stamp', name: 'Stamp', style: 'stamp', bg: '#1A1815', fg: '#FAF7F0', accent: '#C9941F', sub: '{NAME} is officially licensed under Myers — real estate for investors, by investors.' },
    { id: 'quote', name: 'Quote', style: 'quote', bg: '#FAF7F0', fg: '#1A1815', accent: '#C9941F', sub: '' },
    { id: 'grid', name: 'Grid', style: 'grid', bg: '#1A1815', fg: '#FAF7F0', accent: '#C9941F', sub: '' },
  ],

  BUSINESS_CARDS: [
    { id: 'minimal',  name: 'Minimal',  layout: 1, desc: 'Clean typography. Name top, contact bottom.' },
    { id: 'centered', name: 'Centered', layout: 2, desc: 'Symmetric. Logo top, name centered.' },
    { id: 'pattern',  name: 'Pattern',  layout: 3, desc: 'Gold honeycomb wash, distinctive.' },
    { id: 'split',    name: 'Split',    layout: 4, desc: '40/60 vertical split with logo panel.' },
    { id: 'tile',     name: 'Tile',     layout: 5, desc: 'Pattern band left, info right.' },
    { id: 'framed',   name: 'Framed',   layout: 6, desc: 'Hairline border, gold badge.' },
  ],

  SOCIAL_KIT: [
    { id: 'logos', name: 'Logo Pack', desc: 'Full-color, white, and icon-only in PNG, SVG, and AI.', kind: 'logo', files: ['PNG', 'SVG', 'AI'] },
    { id: 'palette', name: 'Color Palette', desc: 'Myers Gold (#F5B021), Dark Gold (#D69B2D), and neutral swatches.', kind: 'palette', files: ['PDF', 'ASE'] },
    { id: 'fonts', name: 'Typography', desc: 'Avenir Book for body/headlines, and Avenir Black for subheads/CTAs.', kind: 'font', files: ['OTF', 'WOFF2'] },
    { id: 'templates', name: 'Story & Post Templates', desc: 'Instagram, LinkedIn, and Facebook templates pre-branded with your photo and name.', kind: 'template', files: ['PSD', 'Canva', 'Figma'] },
  ],
};
