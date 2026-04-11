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
import { lazy } from 'react';

const AdminAgents = lazy(() => import('./pages/AdminAgents'));
const AdminPayouts = lazy(() => import('./pages/AdminPayouts'));
const AdminServices = lazy(() => import('./pages/AdminServices'));
const AdminStats = lazy(() => import('./pages/AdminStats'));
const Affiliate = lazy(() => import('./pages/Affiliate'));
const AffiliateDashboard = lazy(() => import('./pages/AffiliateDashboard'));
const AffiliateLinks = lazy(() => import('./pages/AffiliateLinks'));
const AffiliateProgram = lazy(() => import('./pages/AffiliateProgram'));
const AffiliateReconciliation = lazy(() => import('./pages/AffiliateReconciliation'));
const AgentContests = lazy(() => import('./pages/AgentContests'));
const AgentDeals = lazy(() => import('./pages/AgentDeals'));
const AgentDemo = lazy(() => import('./pages/AgentDemo'));
const AgentMissionControl = lazy(() => import('./pages/AgentMissionControl'));
const AgentPortal = lazy(() => import('./pages/AgentPortal'));
const BecomeAgent = lazy(() => import('./pages/BecomeAgent'));
const CasinoHome = lazy(() => import('./pages/CasinoHome'));
const ClubBasedApps = lazy(() => import('./pages/ClubBasedApps'));
const Compare = lazy(() => import('./pages/Compare'));
const DealsMarketplace = lazy(() => import('./pages/DealsMarketplace'));
const GamificationHub = lazy(() => import('./pages/GamificationHub'));
const Guides = lazy(() => import('./pages/Guides'));
const Home = lazy(() => import('./pages/Home'));
const IntelligenceSlots = lazy(() => import('./pages/IntelligenceSlots'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const MarketingHub = lazy(() => import('./pages/MarketingHub'));
const News = lazy(() => import('./pages/News'));
const OperatorDeals = lazy(() => import('./pages/OperatorDeals'));
const OperatorLanding = lazy(() => import('./pages/OperatorLanding'));
const NewsMonitor = lazy(() => import('./pages/NewsMonitor'));
const PlayerIntelCommand = lazy(() => import('./pages/PlayerIntelCommand'));
const PokerAdvisor = lazy(() => import('./pages/PokerAdvisor'));
const PokerNetworkDetail = lazy(() => import('./pages/PokerNetworkDetail'));
const PokerNetworks = lazy(() => import('./pages/PokerNetworks'));
const PlayerDashboard = lazy(() => import('./pages/PlayerDashboard'));
const PremiumLanding = lazy(() => import('./pages/PremiumLanding'));
const Profile = lazy(() => import('./pages/Profile'));
const ReferralSignup = lazy(() => import('./pages/ReferralSignup'));
const Reviews = lazy(() => import('./pages/Reviews'));
const ServicesMarketplace = lazy(() => import('./pages/ServicesMarketplace'));
const SiteDetail = lazy(() => import('./pages/SiteDetail'));
const SportsbettingHome = lazy(() => import('./pages/SportsbettingHome'));
const Stats = lazy(() => import('./pages/Stats'));
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminAgents": AdminAgents,
    "AdminPayouts": AdminPayouts,
    "AdminServices": AdminServices,
    "AdminStats": AdminStats,
    "Affiliate": Affiliate,
    "AffiliateDashboard": AffiliateDashboard,
    "AffiliateLinks": AffiliateLinks,
    "AffiliateProgram": AffiliateProgram,
    "AffiliateReconciliation": AffiliateReconciliation,
    "AgentContests": AgentContests,
    "AgentDeals": AgentDeals,
    "AgentDemo": AgentDemo,
    "AgentMissionControl": AgentMissionControl,
    "AgentPortal": AgentPortal,
    "BecomeAgent": BecomeAgent,
    "CasinoHome": CasinoHome,
    "ClubBasedApps": ClubBasedApps,
    "Compare": Compare,
    "DealsMarketplace": DealsMarketplace,
    "GamificationHub": GamificationHub,
    "Guides": Guides,
    "Home": Home,
    "IntelligenceSlots": IntelligenceSlots,
    "Leaderboard": Leaderboard,
    "MarketingHub": MarketingHub,
    "News": News,
    "OperatorDeals": OperatorDeals,
    "OperatorLanding": OperatorLanding,
    "NewsMonitor": NewsMonitor,
    "PlayerIntelCommand": PlayerIntelCommand,
    "PokerAdvisor": PokerAdvisor,
    "PokerNetworkDetail": PokerNetworkDetail,
    "PokerNetworks": PokerNetworks,
    "PlayerDashboard": PlayerDashboard,
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
