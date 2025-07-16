import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ✅ Public Site Imports
import ThiaHomePage from "./pages/ThiaHomePage";
import VirtualJewelryOn from "./components/VirtualJewelryOn";
import ProductCard from "./components/ProductCard";
import { sampleProducts } from "./data/products";
import BookAnAppointment from "./components/BookAnAppointment";
import CheckoutPage from "./components/CheckoutPage";
import ContactPage from "./components/ContactPage";
import ContactSection from "./components/ContactSection";
import FeaturedProducts from "./components/FeaturedProducts";
import HowItWorksPage from "./components/HowItWorksPage";
import MaintenanceGuide from "./components/MaintenanceGuide";
import MoreFromCollection from "./components/MoreFromCollection";
import PopularSearches from "./components/PopularSearches";
import PriceBreakdown from "./components/PriceBreakdown";
import ProductList from "./components/ProductList";
import PromoBanner from "./components/PromoBanner";
import SimilarDesigns from "./components/SimilarDesigns";
import ThiaSecurePlanPage from "./components/ThiaSecurePlanPage";
import ProductDetailPage from "./components/ProductDetail";
import CartPage from "./components/CartPage";
import Necklace from "./components/Jewellery-page/Necklace";
import Bangle from "./components/Jewellery-page/Bangle";
import Earring from "./components/Jewellery-page/Earring";
import Chain from "./components/Jewellery-page/Chain";
import Ring from "./components/Jewellery-page/Ring";
import Pendant from "./components/Jewellery-page/Pendant";
import AllJewellery from "./components/Jewellery-page/AllJewellery";

// ✅ Admin Pages & Layout
import AdminLayout from "./components/AdminLayout";
import DashboardHome from "./pages/Admin/DashboardHome";
import ProductManager from "./pages/Admin/ProductManager";
import GoldRateManager from "./pages/Admin/GoldRateManager";
import OrdersManager from "./pages/Admin/OrdersManager";
import CustomersManager from "./pages/Admin/CustomersManager";

import ContactMessages from "./pages/admin/ContactMessages";
import ViewAppointments from "./components/ViewAppointments";
import AdminLogin from "./pages/admin/AdminLogin";
import CardProduct from "./components/CardProduct";
import GoldCollection from "./components/Jewellery-page/GoldCollection";
import SilverCollection from "./components/Jewellery-page/SilverCollection";
import PlatinumCollection from "./components/Jewellery-page/PlatinumCollection";
import DiamondCollection from "./components/Jewellery-page/DiamondCollection";
import ShopByBudget from "./components/Jewellery-page/ShopByBudget";
import UploadImageCMS from "./pages/admin/UploadImageCMS";
import FestiveOffers from "./components/FestiveOffers";
import RecentProducts from "./components/RecentProducts";
import Aboutus from "./components/Aboutus";
import ThiaSecure from "./components/ThiaSecure";
import THIAWorldExclusiveStorefrontPage from "./pages/ThaiworldExclusiveStorefrontPage";
import GoldPriceTrackerPage from "./pages/GoldPriceTrackerPage";
import CustomJewelryOrderPage from "./pages/CustomJewelryOrderPage";
import GoldCertificationPage from "./pages/GoldCertificationPage";
import GolldexWalletPage from "./pages/GolldexWalletPage";
import EscrowPaymentReleasePage from "./components/EscrowPaymentReleasePage";
import RefundAndPayoutTrackingPage from "./components/RefundAndPayoutTrackingPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import NotificationsAlertsPage from "./components/Notifications";
import ReferEarnPage from "./components/ReferEarnPage";
import ProductReviewPage from "./pages/ProductReviewPage";
import AdminSalesAnalyticsPage from "./pages/Admin & Business Management/AdminSalesAnalyticsPage";
import CustomerSupportTicketsPage from "./pages/Admin & Business Management/CustomerSupportTicketsPage";
import VendorPerformanceReportPage from "./pages/Admin & Business Management/VendorPerformanceReportPage";
import ProductModerationPage from "./pages/Admin & Business Management/ProductModerationPage";
import AffiliateMarketingPage from "./pages/Marketing & SEO Automation/AffiliateMarketingPage";
import EmailWhatsAppMarketingPage from "./pages/Marketing & SEO Automation/EmailWhatsAppMarketingPage";
import SeoOptimizationPage from "./pages/Marketing & SEO Automation/SeoOptimizationPage";
import AdsRetargetingPage from "./pages/Marketing & SEO Automation/AdsRetargetingPage";
import DragDropBuilderPage from "./pages/admin/CMS/DragDropBuilderPage";
import MultiLangSupport from "./pages/admin/CMS/LanguageProvider";
import GeoVisibilityToggle from "./pages/admin/CMS/GeoVisibilityToggle";
import RoleManager from "./pages/admin/CMS/RoleManager";
import MediaLibraryPage from "./pages/admin/CMS/MediaLibrary";
import SeoManagerPage from "./pages/admin/CMS/SeoManagerPage";
import PreviewSchedulerPage from "./pages/admin/CMS/PreviewSchedulerPage";
import CMSAdvancedAdminPanel from "./pages/admin/CMS/CMSAdvancedAdminPanel";


export default function App() {
  return (
    <Routes>
      {/* ✅ PUBLIC SITE ROUTES */}
      <Route path="/" element={<ThiaHomePage />} />
      <Route path="/virtual-jewelry-on" element={<VirtualJewelryOn />} />
      <Route
        path="/product-card"
        element={
          <ProductCard
            product={sampleProducts[0]}
            isWishlisted={false}
            toggleWishlist={() => {}}
          />
        }
      />
      <Route path="/thia-world-exclusive-storefront" element={<THIAWorldExclusiveStorefrontPage/>} />
      <Route path="/gold-price-tracker" element={<GoldPriceTrackerPage/>} />
      <Route path="/customer-jewelry" element={<CustomJewelryOrderPage/>} />
       <Route path="/gold-certification" element={<GoldCertificationPage/>} />
      <Route path="/golldex-wallet" element={<GolldexWalletPage/>} />
      <Route path="/escrow-payment-release" element={<EscrowPaymentReleasePage/>} />
      <Route path="/refund-and-payout-tracking" element={<RefundAndPayoutTrackingPage/>} />
      <Route path="/account-settings" element={<AccountSettingsPage />} />
      <Route path="/notifications" element={<NotificationsAlertsPage />} />
      <Route path="/refer-earn" element={<ReferEarnPage/>} />
      <Route path="/product-review" element={< ProductReviewPage/>} />
      <Route path="/admin-sales-analytics" element={<AdminSalesAnalyticsPage />} />
      <Route path="/customer-support-tickets" element={<CustomerSupportTicketsPage />} />
      <Route path="/VendorPerformanceReport" element={<VendorPerformanceReportPage/>} />
      <Route path="/product-moderation" element={<ProductModerationPage />} />
      <Route path="/affiliate-marketing" element={<AffiliateMarketingPage/>} />
     <Route path="/email-whatsapp-marketing" element={<EmailWhatsAppMarketingPage />} />
      <Route path="/seo-optimization" element={<SeoOptimizationPage />} />
      <Route path="/ads-retarget" element={<AdsRetargetingPage />} />


      <Route path="/book-an-appointment" element={<BookAnAppointment />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/contact-page" element={<ContactPage />} />
      <Route path="/contact-section" element={<ContactSection />} />
      <Route path="/featured-products" element={<FeaturedProducts />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/maintenance-guide" element={<MaintenanceGuide />} />
      <Route path="/more-from-collection" element={<MoreFromCollection />} />
      <Route path="/popular-searches" element={<PopularSearches />} />
      <Route path="/price-breakdown" element={<PriceBreakdown />} />
      <Route path="/product-list" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/promo-banner" element={<PromoBanner />} />
      <Route path="/similar-designs" element={<SimilarDesigns />} />
      <Route path="/thia-secure-plan" element={<ThiaSecurePlanPage />} />
      <Route path="/admin/contact-messages" element={<ContactMessages />} />
      <Route path="/view-appointments" element={<ViewAppointments />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/card-product" element={<CardProduct />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/all-jewellery" element={<AllJewellery />} />
      <Route path="/necklace" element={<Necklace />} />
      <Route path="/bangle" element={<Bangle />} />
      <Route path="/earring" element={<Earring />} />
      <Route path="/chain" element={<Chain />} />
      <Route path="/ring" element={<Ring />} />
      <Route path="/pendant" element={<Pendant />} />
      <Route path="/goldrate" element={<GoldRateManager />} />
      <Route path="/uploadimage" element={<UploadImageCMS />} />
      <Route path="/new-arrivals"  element={<RecentProducts/>}/>
      <Route path="/aboutus" element={<Aboutus />} />
      <Route path="/thia-secure" element={<ThiaSecure />} />
      24.06.2025
      <Route path="/shop-by-budget" element={<ShopByBudget />} />
      <Route path="/gold-collection" element={<GoldCollection />} />
      <Route path="/silver-collection" element={<SilverCollection />} />
      <Route path="/platinum-collection" element={<PlatinumCollection />} />
      <Route path="/diamond-collection" element={<DiamondCollection />} />
      <Route path="/festive-offers" element={<FestiveOffers />} />

     
       <Route path="/cms-panel-admin" element={<CMSAdvancedAdminPanel/>} /> 
     

      {/* Admin Panel */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="orders" element={<OrdersManager />} />
        <Route path="customers" element={<CustomersManager />} /> 
        
        {/* created by medun */} 
        <Route path="dragdrop" element={<DragDropBuilderPage />} /> 
        <Route path="multi-language" element={<MultiLangSupport />} /> 
        <Route path="geo-visibility" element={<GeoVisibilityToggle />} /> 
         <Route path="roles-manager" element={<RoleManager/>} /> 
         <Route path="media" element={<MediaLibraryPage/>} /> 
         <Route path="seo-manager" element={<SeoManagerPage/>} /> 
          <Route path="preview-scheduler" element={<PreviewSchedulerPage/>} /> 
         <Route path="cms-panel-admin" element={<CMSAdvancedAdminPanel/>} /> 
     
      </Route>
    </Routes>
  );
}
