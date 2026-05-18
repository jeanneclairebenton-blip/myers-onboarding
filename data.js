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
      ],
    },
    {
      id: 'paperwork',
      num: '02',
      title: 'Paperwork',
      subtitle: 'Sign your agreements',
      description: 'Three documents to sign. Your sponsorship agreement affiliates you with Myers, the W-9 sets up your 1099, and the CC authorization covers your monthly membership.',
      tasks: [
        { id: 'sponsorship', title: 'Sponsorship Agreement', desc: 'Official affiliation with Myers Home Buyers.', icon: 'signature' },
        { id: 'w9', title: 'W-9 Form', desc: '1099 contractor tax documentation.', icon: 'receipt' },
        { id: 'cc-auth', title: 'CC Authorization', desc: '$149/mo membership fee authorization.', icon: 'creditcard' },
      ],
    },
    {
      id: 'licensing',
      num: '03',
      title: 'Licensing',
      subtitle: 'Transfer your license',
      description: 'Move your real estate license to Myers via TREC and get your MLS access set up through MetroTex.',
      tasks: [
        { id: 'trec-transfer', title: 'TREC License Transfer', desc: 'Log in to your TREC portal and transfer your license to Myers (License #9005311-BB).', icon: 'key',
          links: [{ label: 'TREC Portal', href: 'https://www.trec.texas.gov/' }] },
        { id: 'mls-access', title: 'MLS / MetroTex Access', desc: 'Confirm your MetroTex MLS membership is active and linked to Myers brokerage.', icon: 'home',
          links: [{ label: 'MetroTex MLS', href: 'https://www.ntreis.net/' }] },
        { id: 'license-verify', title: 'Verify License Number', desc: 'Confirm your license number is on file with us for compliance records.', icon: 'shield', optional: true },
      ],
    },
    {
      id: 'tools',
      num: '04',
      title: 'Tech & Tools',
      subtitle: 'Get your systems running',
      description: 'Access to the platforms you\'ll use daily: CRM, contracts, safety, and communication.',
      tasks: [
        { id: 'zoho-crm', title: 'Zoho CRM', desc: 'Your lead management and deal pipeline system. Accept the invite from your email.', icon: 'folder', accent: '#2E5C8A',
          links: [{ label: 'Open Zoho', href: 'https://crm.zoho.com' }], group: 'Deal Management' },
        { id: 'zip-forms', title: 'Zip Forms', desc: 'Digital contract management. Log in and confirm your profile is linked to Myers.', icon: 'doc', accent: '#4F7A3A',
          links: [{ label: 'Zip Forms', href: 'https://www.zipforms.com' }], group: 'Deal Management' },
        { id: 'forewarn', title: 'ForeWarn', desc: 'Safety-first identity verification. Download the app and register with your Myers email.', icon: 'shield', accent: '#B0432A',
          links: [{ label: 'App Store', href: '#' }, { label: 'Google Play', href: '#' }], group: 'Safety & Comms' },
        { id: 'slack', title: 'Join Slack', desc: 'Team communication hub. Join #general, #deals, and #askmeanything2026.', icon: 'chat', accent: '#6B4E8E',
          links: [{ label: 'Open Slack', href: '#' }], group: 'Safety & Comms' },
        { id: 'google-cal', title: 'Google Calendar', desc: 'Subscribe to the Myers team calendar for meetings, trainings, and events.', icon: 'calendar', accent: '#C9941F', optional: true,
          group: 'Safety & Comms' },
      ],
    },
    {
      id: 'brand',
      num: '05',
      title: 'Marketing & Brand',
      subtitle: 'Build your presence',
      description: 'Launch your professional brand. Create your announcement post, set up your email signature, order business cards, and get your website live.',
      isMarketing: true,
      tasks: [
        { id: 'welcome-post', title: 'Welcome Announcement', desc: 'Pick a template, add your headshot, download, and post to social media. Six premium designs available.', icon: 'sparkle', action: 'welcome-post' },
        { id: 'email-sig', title: 'Email Signature', desc: 'Build a branded Gmail signature with your photo, title, and license number.', icon: 'mail', action: 'email-sig', optional: true },
        { id: 'cards', title: 'Business Cards', desc: 'Choose a layout, preview front and back, and order 250 soft-touch matte cards.', icon: 'doc', action: 'cards' },
        { id: 'website', title: 'Carrot Website', desc: 'Launch your free IDX investor site through our Carrot partnership.', icon: 'external', action: 'website' },
        { id: 'social-kit', title: 'Social Brand Kit', desc: 'Download logos, fonts, palette, story templates, and listing flyers.', icon: 'download', action: 'social', optional: true },
      ],
    },
    {
      id: 'closing',
      num: '06',
      title: 'Ready to Close',
      subtitle: 'Final steps before launch',
      description: 'You\'re almost there. Complete your first deal walkthrough and confirm you\'re ready to start receiving leads.',
      tasks: [
        { id: 'deal-walkthrough', title: 'Deal Walkthrough', desc: 'Review the end-to-end deal process — from lead assignment to closing.', icon: 'money',
          links: [{ label: 'Deal Flow Guide', href: '#' }] },
        { id: 'first-meeting', title: 'Schedule Intro Call', desc: 'Book a 15-minute call with your team lead to discuss your first 30 days.', icon: 'calendar',
          links: [{ label: 'Book via Calendly', href: '#' }] },
        { id: 'lead-ready', title: 'Mark Lead-Ready', desc: 'Confirm all systems are set up and you\'re ready to receive your first lead assignment.', icon: 'zap', accent: 'var(--green)' },
      ],
    },
  ],

  TEAM: [
    { id: 'josh', name: 'Josh DeShong', initials: 'JD', role: 'CEO & Principal Broker', bio: 'Founder and principal broker. Josh built Myers to help agents think like investors, not salespeople. He oversees strategy, brokerage operations, and deal quality.', email: 'josh@myershomebuyers.com' },
    { id: 'jeanne', name: 'Jeanne Benton', initials: 'JB', role: 'Director of Operations', bio: 'Manages agent onboarding, marketing systems, and daily operations. Your main point of contact for anything from tech issues to deal questions.', email: 'jeanne@myershomebuyers.com' },
    { id: 'mike', name: 'Mike Thompson', initials: 'MT', role: 'Lead Acquisitions Manager', bio: 'Runs the acquisitions pipeline across DFW. Mike reviews offers, manages investor relationships, and coaches agents on winning bids.', email: 'mike@myershomebuyers.com' },
    { id: 'sarah', name: 'Sarah Lin', initials: 'SL', role: 'Transaction Coordinator', bio: 'Handles all contract-to-close details — title, inspections, timelines. If you need a document or have a closing question, Sarah has the answer.', email: 'sarah@myershomebuyers.com' },
    { id: 'carlos', name: 'Carlos Vega', initials: 'CV', role: 'Marketing & Design', bio: 'Creates all brand materials, manages social channels, and keeps the Myers visual identity consistent across every touchpoint.', email: 'carlos@myershomebuyers.com' },
    { id: 'rachel', name: 'Rachel Kim', initials: 'RK', role: 'Agent Success Coach', bio: 'Helps new agents hit their stride. Rachel runs training sessions, reviews scripts, and designs the 30-60-90 day development plan.', email: 'rachel@myershomebuyers.com' },
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
    { id: 'classic', name: 'Classic Gold', bg: '#FAF7F0', fg: '#1A1815', accent: '#C9941F' },
    { id: 'dark', name: 'Dark Studio', bg: '#1A1815', fg: '#FAF7F0', accent: '#C9941F' },
    { id: 'cream', name: 'Cream & Ink', bg: '#FBE8B7', fg: '#1A1815', accent: '#8B6B1A' },
    { id: 'slate', name: 'Slate', bg: '#2C3E50', fg: '#ECF0F1', accent: '#C9941F' },
  ],

  SOCIAL_KIT: [
    { id: 'logos', name: 'Logo Pack', desc: 'Full-color, white, and icon-only in PNG, SVG, and AI.', kind: 'logo', files: ['PNG', 'SVG', 'AI'] },
    { id: 'palette', name: 'Color Palette', desc: 'Primary, secondary, and neutral swatches with HEX, RGB, and HSL values.', kind: 'palette', files: ['PDF', 'ASE'] },
    { id: 'fonts', name: 'Typography', desc: 'DM Serif Display, Mulish, and JetBrains Mono — with usage guidelines.', kind: 'font', files: ['OTF', 'WOFF2'] },
    { id: 'templates', name: 'Story & Post Templates', desc: 'Instagram, LinkedIn, and Facebook templates pre-branded with your photo and name.', kind: 'template', files: ['PSD', 'Canva', 'Figma'] },
  ],
};
