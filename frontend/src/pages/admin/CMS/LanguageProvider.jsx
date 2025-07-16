import React from 'react';
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useNavigate } from 'react-router-dom'; // ✅ NEW

// ✅ MOCK JSON Translation Data (Embedded)
const resources = {
  en: {
    translation: {
      title: 'Welcome to BBSCART',
      description: 'Access affordable healthcare in your language.',
      switchLanguage: 'Switch Language',
      cta: 'Explore Plans'
    }
  },
  ta: {
    translation: {
      title: 'BBSCART-க்கு வரவேற்கிறோம்',
      description: 'உங்கள் மொழியில் கிடைக்கும் சுகாதார சேவைகள்.',
      switchLanguage: 'மொழியை மாற்றவும்',
      cta: 'திட்டங்களை காண்க'
    }
  },
  ar: {
    translation: {
      title: 'مرحبًا بك في BBSCART',
      description: 'الوصول إلى الرعاية الصحية بلغتك.',
      switchLanguage: 'تبديل اللغة',
      cta: 'استكشاف الخطط'
    }
  }
};

// ✅ i18n Initialization (Inline)
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

const languages = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ta', label: 'தமிழ்', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' }
];

const MultiLangSupport = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // ✅ Hook for navigation

  const changeLanguage = (code) => {
    const selectedLang = languages.find((l) => l.code === code);
    i18n.changeLanguage(code);
    document.dir = selectedLang?.dir || 'ltr';
    localStorage.setItem('language', code);
  };

  const handleExploreClick = () => {
    navigate('/plans'); // ✅ Redirect to plans page
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-between align-items-center mb-4">
        <Col xs={12} md={6}>
          <h1>{t('title')}</h1>
          <p>{t('description')}</p>
          <Button variant="primary" onClick={handleExploreClick}>
            {t('cta')}
          </Button>
        </Col>
        <Col xs="auto">
          <Dropdown onSelect={changeLanguage}>
            <Dropdown.Toggle variant="secondary" id="dropdown-lang">
              {t('switchLanguage')}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {languages.map((lang) => (
                <Dropdown.Item key={lang.code} eventKey={lang.code}>
                  {lang.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
};

export default MultiLangSupport;
