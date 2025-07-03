import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const LanguageSelector = () => {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode)
  }

  return (
    <div className="language-selector">
      <Dropdown>
        <Dropdown.Toggle variant="outline-warning" size="sm">
          {currentLanguage.flag} {currentLanguage.name}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {languages.map((language) => (
            <Dropdown.Item
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              active={language.code === i18n.language}
            >
              {language.flag} {language.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default LanguageSelector