/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AdminAgents from './pages/AdminAgents';
import AdminPayouts from './pages/AdminPayouts';
import AdminServices from './pages/AdminServices';
import AdminStats from './pages/AdminStats';
import Affiliate from './pages/Affiliate';
import AffiliateLinks from './pages/AffiliateLinks';
import AffiliateProgram from './pages/AffiliateProgram';
import AgentContests from './pages/AgentContests';
import AgentDeals from './pages/AgentDeals';
import AgentDemo from './pages/AgentDemo';
import AgentMissionControl from './pages/AgentMissionControl';
import AgentPortal from './pages/AgentPortal';
import BecomeAgent from './pages/BecomeAgent';
import CasinoHome from './pages/CasinoHome';
import ClubBasedApps from './pages/ClubBasedApps';
import Compare from './pages/Compare';
import GamificationHub from './pages/GamificationHub';
import Guides from './pages/Guides';
import Home from './pages/Home';
import IntelligenceSlots from './pages/IntelligenceSlots';
import Leaderboard from './pages/Leaderboard';
import MarketingHub from './pages/MarketingHub';
import News from './pages/News';
import NewsMonitor from './pages/NewsMonitor';
import PlayerIntelCommand from './pages/PlayerIntelCommand';
import PokerAdvisor from './pages/PokerAdvisor';
import PokerNetworkDetail from './pages/PokerNetworkDetail';
import PokerNetworks from './pages/PokerNetworks';
import PremiumLanding from './pages/PremiumLanding';
import Profile from './pages/Profile';
import ReferralSignup from './pages/ReferralSignup';
import Reviews from './pages/Reviews';
import ServicesMarketplace from './pages/ServicesMarketplace';
import SiteDetail from './pages/SiteDetail';
import SportsbettingHome from './pages/SportsbettingHome';
import Stats from './pages/Stats';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminAgents": AdminAgents,
    "AdminPayouts": AdminPayouts,
    "AdminServices": AdminServices,
    "AdminStats": AdminStats,
    "Affiliate": Affiliate,
    "AffiliateLinks": AffiliateLinks,
    "AffiliateProgram": AffiliateProgram,
    "AgentContests": AgentContests,
    "AgentDeals": AgentDeals,
    "AgentDemo": AgentDemo,
    "AgentMissionControl": AgentMissionControl,
    "AgentPortal": AgentPortal,
    "BecomeAgent": BecomeAgent,
    "CasinoHome": CasinoHome,
    "ClubBasedApps": ClubBasedApps,
    "Compare": Compare,
    "GamificationHub": GamificationHub,
    "Guides": Guides,
    "Home": Home,
    "IntelligenceSlots": IntelligenceSlots,
    "Leaderboard": Leaderboard,
    "MarketingHub": MarketingHub,
    "News": News,
    "NewsMonitor": NewsMonitor,
    "PlayerIntelCommand": PlayerIntelCommand,
    "PokerAdvisor": PokerAdvisor,
    "PokerNetworkDetail": PokerNetworkDetail,
    "PokerNetworks": PokerNetworks,
    "PremiumLanding": PremiumLanding,
    "Profile": Profile,
    "ReferralSignup": ReferralSignup,
    "Reviews": Reviews,
    "ServicesMarketplace": ServicesMarketplace,
    "SiteDetail": SiteDetail,
    "SportsbettingHome": SportsbettingHome,
    "Stats": Stats,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};