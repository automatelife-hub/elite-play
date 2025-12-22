import AdminStats from './pages/AdminStats';
import Affiliate from './pages/Affiliate';
import AffiliateLinks from './pages/AffiliateLinks';
import AgentPortal from './pages/AgentPortal';
import BecomeAgent from './pages/BecomeAgent';
import CasinoHome from './pages/CasinoHome';
import Compare from './pages/Compare';
import Guides from './pages/Guides';
import Home from './pages/Home';
import NewsMonitor from './pages/NewsMonitor';
import PokerAdvisor from './pages/PokerAdvisor';
import PokerHome from './pages/PokerHome';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';
import SiteDetail from './pages/SiteDetail';
import SportsbettingHome from './pages/SportsbettingHome';
import Stats from './pages/Stats';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminStats": AdminStats,
    "Affiliate": Affiliate,
    "AffiliateLinks": AffiliateLinks,
    "AgentPortal": AgentPortal,
    "BecomeAgent": BecomeAgent,
    "CasinoHome": CasinoHome,
    "Compare": Compare,
    "Guides": Guides,
    "Home": Home,
    "NewsMonitor": NewsMonitor,
    "PokerAdvisor": PokerAdvisor,
    "PokerHome": PokerHome,
    "Profile": Profile,
    "Reviews": Reviews,
    "SiteDetail": SiteDetail,
    "SportsbettingHome": SportsbettingHome,
    "Stats": Stats,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};