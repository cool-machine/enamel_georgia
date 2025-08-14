import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ka';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Translation data
const translations = {
  en: {
    // Header
    'header.title': 'Émaux Georgia',
    'header.subtitle': 'Georgian Enamel Colors',
    'header.home': 'Home',
    'header.products': 'Products',
    'header.about': 'About',
    'header.contact': 'Contact',
    'header.search': 'Search enamels...',
    'header.account': 'My Account',
    'header.admin': 'Admin Dashboard',
    'header.signin': 'Sign In',
    'header.register': 'Register',
    'header.signout': 'Sign Out',

    // Homepage
    'home.hero.title': 'Authentic French',
    'home.hero.subtitle': 'Enamel Artistry',
    'home.hero.description': 'Premium jewelry enamels from France\'s finest craftsmen, now available in Georgia. Create stunning pieces with colors that have inspired artists for centuries.',
    'home.hero.shopButton': 'Shop Enamels',
    'home.hero.learnButton': 'Learn More',
    
    'home.features.title': 'Why Choose Émaux Georgia?',
    'home.features.subtitle': 'We bring you the finest French enameling tradition with modern convenience',
    'home.features.quality.title': 'Premium Quality',
    'home.features.quality.desc': 'Authentic French enamels from Emaux Soyer, trusted by artisans worldwide',
    'home.features.delivery.title': 'Fast Delivery',
    'home.features.delivery.desc': 'Quick shipping throughout Georgia with secure packaging',
    'home.features.secure.title': 'Secure Shopping',
    'home.features.secure.desc': 'Safe transactions with multiple payment options',
    'home.features.support.title': 'Expert Support',
    'home.features.support.desc': 'Professional guidance for all your enameling projects',

    'home.featured.title': 'Featured Enamel Colors',
    'home.featured.subtitle': 'Discover our most popular French enamel selections',
    'home.featured.viewAll': 'View All Products',

    'home.newsletter.title': 'Stay Updated with New Arrivals',
    'home.newsletter.subtitle': 'Be the first to know about new enamel colors, special offers, and enameling tips from our experts.',
    'home.newsletter.placeholder': 'Enter your email',
    'home.newsletter.subscribe': 'Subscribe',

    // Products
    'products.title': 'French Enamel Collection',
    'products.subtitle': 'Discover our complete Emaux Soyer collection: Transparents, Opaques & Opales',
    'products.search': 'Search by name, color, or enamel number...',
    'products.sortByName': 'Sort by Name',
    'products.sortByNumber': 'Sort by Number',
    'products.sortByPriceLow': 'Price: Low to High',
    'products.sortByPriceHigh': 'Price: High to Low',
    'products.filters': 'Filters',
    'products.showing': 'Showing',
    'products.of': 'of',
    'products.products': 'products',
    'products.noResults': 'No products found matching your criteria.',
    'products.clearFilters': 'Clear all filters',
    'products.addToCart': 'Add to Cart',
    'products.viewDetails': 'View Details',

    // Filters
    'filters.title': 'Filters',
    'filters.category': 'Category',
    'filters.type': 'Type',
    'filters.priceRange': 'Price Range (₾)',
    'filters.to': 'to',
    'filters.clearAll': 'Clear All Filters',
    'filters.allCategories': 'All Categories',
    'filters.allTypes': 'All Types',
    'filters.transparent': 'Transparents',
    'filters.opaque': 'Opaques',
    'filters.opale': 'Opales',

    // Product Detail
    'detail.backToProducts': 'Back to Products',
    'detail.weight': 'Weight',
    'detail.quantity': 'Quantity',
    'detail.inStock': 'in stock',
    'detail.addToCart': 'Add to Cart',
    'detail.total': 'Total',
    'detail.freeShipping': 'Free Shipping',
    'detail.freeShippingDesc': 'On orders over ₾100',
    'detail.qualityGuarantee': 'Quality Guarantee',
    'detail.qualityDesc': 'Authentic French enamel',
    'detail.easyReturns': 'Easy Returns',
    'detail.returnsDesc': '30-day return policy',
    'detail.specifications': 'Technical Specifications',
    'detail.enamelNumber': 'Enamel Number',
    'detail.firingTemp': 'Firing Temperature',
    'detail.meshSize': 'Mesh Size',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyDesc': 'Looks like you haven\'t added any French enamels to your cart yet.',
    'cart.continueShopping': 'Continue Shopping',
    'cart.items': 'Cart Items',
    'cart.size': 'Size',
    'cart.color': 'Color',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.freeShippingPromo': 'Add ₾{amount} more for free shipping!',
    'cart.checkout': 'Proceed to Checkout',

    // Footer
    'footer.company': 'Émaux Georgia',
    'footer.tagline': 'French Enamel Artistry',
    'footer.description': 'Premium French enamels for jewelry making, bringing traditional craftsmanship to Georgian artisans since 2024.',
    'footer.products': 'Products',
    'footer.customerService': 'Customer Service',
    'footer.contact': 'Contact Us',
    'footer.businessHours': 'Business Hours',
    'footer.businessHoursDesc': 'Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM',
    'footer.copyright': '© 2024 Émaux Georgia. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
  ka: {
    // Header
    'header.title': 'ემოხი საქართველო',
    'header.subtitle': 'ქართული მინანქრის ფერები',
    'header.home': 'მთავარი',
    'header.products': 'პროდუქტები',
    'header.about': 'ჩვენ შესახებ',
    'header.contact': 'კონტაქტი',
    'header.search': 'მინანქრების ძიება...',
    'header.account': 'ჩემი ანგარიში',
    'header.admin': 'ადმინისტრაციის პანელი',
    'header.signin': 'შესვლა',
    'header.register': 'რეგისტრაცია',
    'header.signout': 'გასვლა',

    // Homepage
    'home.hero.title': 'ავთენტური ფრანგული',
    'home.hero.subtitle': 'მინანქრის ხელოვნება',
    'home.hero.description': 'პრემიუმ სამკაულების მინანქრები საფრანგეთის საუკეთესო ოსტატებისგან, ახლა ხელმისაწვდომი საქართველოში. შექმენით თვალისმომჭრელი ნაწარმოები ისეთი ფერებით, რომლებიც საუკუნეებია შთააგონებს მხატვრებს.',
    'home.hero.shopButton': 'მინანქრების ყიდვა',
    'home.hero.learnButton': 'გაიგე მეტი',
    
    'home.features.title': 'რატომ აირჩიოთ ემოხი საქართველო?',
    'home.features.subtitle': 'ჩვენ მოგაწვდით ფრანგული მინანქრის საუკეთესო ტრადიციას თანამედროვე სიმარტივით',
    'home.features.quality.title': 'პრემიუმ ხარისხი',
    'home.features.quality.desc': 'ავთენტური ფრანგული მინანქრები Emaux Soyer-სგან, რომელსაც ენდობიან ოსტატები მთელ მსოფლიოში',
    'home.features.delivery.title': 'სწრაფი მიწოდება',
    'home.features.delivery.desc': 'სწრაფი მიწოდება მთელ საქართველოში უსაფრთხო შეფუთვით',
    'home.features.secure.title': 'უსაფრთხო შენაძენი',
    'home.features.secure.desc': 'უსაფრთხო ტრანზაქციები მრავალი გადახდის ვარიანტით',
    'home.features.support.title': 'ექსპერტის მხარდაჭერა',
    'home.features.support.desc': 'პროფესიონალური ხელმძღვანელობა თქვენი ყველა მინანქრის პროექტისთვის',

    'home.featured.title': 'გამორჩეული მინანქრის ფერები',
    'home.featured.subtitle': 'აღმოაჩინეთ ჩვენი ყველაზე პოპულარული ფრანგული მინანქრის შერჩევანი',
    'home.featured.viewAll': 'ყველა პროდუქტის ნახვა',

    'home.newsletter.title': 'იყავით კურსში ახალ შემოსვლებზე',
    'home.newsletter.subtitle': 'პირველებმა შეიტყვეთ ახალი მინანქრის ფერების, სპეციალური შეთავაზებების და ჩვენი ექსპერტების მინანქრის რჩევების შესახებ.',
    'home.newsletter.placeholder': 'შეიყვანეთ თქვენი ელ. ფოსტა',
    'home.newsletter.subscribe': 'გამოწერა',

    // Products
    'products.title': 'ფრანგული მინანქრის კოლექცია',
    'products.subtitle': 'აღმოაჩინეთ ჩვენი სრული Emaux Soyer კოლექცია: გამჭვირვალე, მუქი და ოპალური',
    'products.search': 'ძიება სახელით, ფერით ან მინანქრის ნომრით...',
    'products.sortByName': 'დალაგება სახელით',
    'products.sortByNumber': 'დალაგება ნომრით',
    'products.sortByPriceLow': 'ფასი: დაბლიდან მაღლამდე',
    'products.sortByPriceHigh': 'ფასი: მაღლიდან დაბლამდე',
    'products.filters': 'ფილტრები',
    'products.showing': 'ნაჩვენებია',
    'products.of': '-დან',
    'products.products': 'პროდუქტი',
    'products.noResults': 'თქვენს კრიტერიუმებს შესაბამისი პროდუქტი ვერ მოიძებნა.',
    'products.clearFilters': 'ყველა ფილტრის გასუფთავება',
    'products.addToCart': 'კალათაში დამატება',
    'products.viewDetails': 'დეტალების ნახვა',

    // Filters
    'filters.title': 'ფილტრები',
    'filters.category': 'კატეგორია',
    'filters.type': 'ტიპი',
    'filters.priceRange': 'ფასის დიაპაზონი (₾)',
    'filters.to': '-დან',
    'filters.clearAll': 'ყველა ფილტრის გასუფთავება',
    'filters.allCategories': 'ყველა კატეგორია',
    'filters.allTypes': 'ყველა ტიპი',
    'filters.transparent': 'გამჭვირვალე',
    'filters.opaque': 'მუქი',
    'filters.opale': 'ოპალური',

    // Product Detail
    'detail.backToProducts': 'დაბრუნება პროდუქტებზე',
    'detail.weight': 'წონა',
    'detail.quantity': 'რაოდენობა',
    'detail.inStock': 'საწყობშია',
    'detail.addToCart': 'კალათაში დამატება',
    'detail.total': 'სულ',
    'detail.freeShipping': 'უფასო მიწოდება',
    'detail.freeShippingDesc': '₾100-ზე მეტი შეკვეთებისთვის',
    'detail.qualityGuarantee': 'ხარისხის გარანტია',
    'detail.qualityDesc': 'ავთენტური ფრანგული მინანქარი',
    'detail.easyReturns': 'მარტივი დაბრუნება',
    'detail.returnsDesc': '30-დღიანი დაბრუნების პოლიტიკა',
    'detail.specifications': 'ტექნიკური მახასიათებლები',
    'detail.enamelNumber': 'მინანქრის ნომერი',
    'detail.firingTemp': 'დაწვის ტემპერატურა',
    'detail.meshSize': 'ქსელის ზომა',

    // Cart
    'cart.title': 'საყიდლების კალათა',
    'cart.empty': 'თქვენი კალათა ცარიელია',
    'cart.emptyDesc': 'როგორც ჩანს, ჯერ არ დაგიმატებიათ ფრანგული მინანქრები კალათაში.',
    'cart.continueShopping': 'ყიდვის გაგრძელება',
    'cart.items': 'კალათის ნივთები',
    'cart.size': 'ზომა',
    'cart.color': 'ფერი',
    'cart.subtotal': 'ქვესумა',
    'cart.shipping': 'მიწოდება',
    'cart.free': 'უფასო',
    'cart.total': 'სულ',
    'cart.freeShippingPromo': 'დაამატეთ კიდევ ₾{amount} უფასო მიწოდებისთვის!',
    'cart.checkout': 'გადახდაზე გადასვლა',

    // Footer
    'footer.company': 'ემოხი საქართველო',
    'footer.tagline': 'ფრანგული მინანქრის ხელოვნება',
    'footer.description': 'პრემიუმ ფრანგული მინანქრები სამკაულების დასამზადებლად, ტრადიციული ოსტატობის მიწოდება ქართველ ოსტატებისთვის 2024 წლიდან.',
    'footer.products': 'პროდუქტები',
    'footer.customerService': 'მომხმარებელთა სერვისი',
    'footer.contact': 'დაგვიკავშირდით',
    'footer.businessHours': 'სამუშაო საათები',
    'footer.businessHoursDesc': 'ორშ-პარ: 9:00 - 18:00\nშაბ: 10:00 - 16:00',
    'footer.copyright': '© 2024 ემოხი საქართველო. ყველა უფლება დაცულია.',
    'footer.privacy': 'კონფიდენციალურობის პოლიტიკა',
    'footer.terms': 'მომსახურების წესები',

    // Common
    'common.loading': 'იტვირთება...',
    'common.error': 'შეცდომა',
    'common.success': 'წარმატება',
    'common.cancel': 'გაუქმება',
    'common.save': 'შენახვა',
    'common.edit': 'რედაქტირება',
    'common.delete': 'წაშლა',
    'common.close': 'დახურვა',
    'common.yes': 'კი',
    'common.no': 'არა',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  const t = (key: string): string => {
    const translation = translations[currentLanguage][key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation;
  };

  // Initialize language from localStorage
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ka')) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};