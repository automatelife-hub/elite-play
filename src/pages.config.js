import Home from './pages/Home';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import AdminStats from './pages/AdminStats';
import Compare from './pages/Compare';
import Guides from './pages/Guides';
import PokerAdvisor from './pages/PokerAdvisor';
import SiteDetail from './pages/SiteDetail';
import NewsMonitor from './pages/NewsMonitor';
import AgentPortal from './pages/AgentPortal';
import Affiliate from './pages/Affiliate';
import BecomeAgent from './pages/BecomeAgent';
import AffiliateLinks from './pages/AffiliateLinks';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Reviews": Reviews,
    "Profile": Profile,
    "Stats": Stats,
    "AdminStats": AdminStats,
    "Compare": Compare,
    "Guides": Guides,
    "PokerAdvisor": PokerAdvisor,
    "SiteDetail": SiteDetail,
    "NewsMonitor": NewsMonitor,
    "AgentPortal": AgentPortal,
    "Affiliate": Affiliate,
    "BecomeAgent": BecomeAgent,
    "AffiliateLinks": AffiliateLinks,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};