import { RouteKeys } from '../appRoutes';

const routes: RouteKeys = {
    home: '/da',
    about: '/da/om',
    howItWorks: '/da/hvordan-det-virker',
    becomeDj: '/da/bliv-dj',
    signUp: '/da/tilmeld',
    user: '/da/user',
    bookDj: '/da/lej-dj/:country/:city?',
    bookDjOverview: '/da/lej-dj',
    blog: '/da/blog',
    faq: '/da/faq',
    faqDj: '/da/faq/dj',
    faqOrganizer: '/da/faq/arrangoer',
    notFound: '/da/ikke-fundet',
    event: '/da/event',
    completeSignup: '/da/completeSignup',
    terms: '/da/betingelser',
    gig: '/da/gig',
    resetPassword: '/da/resetPassword',
    termsAgreements: '/da/betingelser/aftaler',
    termsPrivacy: '/da/betingelser/privatliv',
};

export default routes;
