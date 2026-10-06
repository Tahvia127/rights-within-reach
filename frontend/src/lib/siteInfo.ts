// Who runs the site and how to reach them. Single source of truth for the
// footer and every legal page, so a change here updates them all.
//
// TODO(owner): confirm these before launch. If the project moves under an LLC,
// nonprofit, or fiscal sponsor, put that legal name in `operator`, and add a
// mailing address if you want one published.
export const SITE = {
  name: 'Rights Within Reach',
  url: 'https://www.rightswithinreach.org',
  operator: "La'Tahvia Williams",
  location: 'Chicago, Illinois, USA',
  email: 'hello@rightswithinreach.org',
  repo: 'https://github.com/Tahvia127/rights-within-reach',
  /** Bump whenever a legal page changes in substance. */
  legalUpdated: 'October 6, 2026',
  copyrightYear: 2026,
} as const
