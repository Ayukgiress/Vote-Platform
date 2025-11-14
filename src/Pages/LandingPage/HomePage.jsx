import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiBarChart,
  FiCalendar,
  FiCheck,
  FiGlobe,
  FiShield,
  FiSmartphone,
  FiUsers,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useTheme } from "../Contexts/ThemeContext";
import heroImage from "/src/assets/images/pexels-steve-29506613.jpg";
import voteImage from "/src/assets/images/Screen Shot 2024-12-20 at 10.05.41 PM-fotor-202412202369.png";
import studentImage from "/src/assets/images/pexels-max-fischer-5211432.jpg";
import teacherImage from "/src/assets/images/pexels-nappy-935943.jpg";
import institutionImage from "/src/assets/images/pexels-cruz-in-portugal-20843082.jpg";


const HomePage = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const stats = [
    { label: t('home.stats.0.label'), value: t('home.stats.0.value') },
    { label: t('home.stats.1.label'), value: t('home.stats.1.value') },
    { label: t('home.stats.2.label'), value: t('home.stats.2.value') },
    { label: t('home.stats.3.label'), value: t('home.stats.3.value') },
  ];

  const features = [
    {
      title: t('home.features.items.0.title'),
      description: t('home.features.items.0.description'),
      icon: FiShield,
    },
    {
      title: t('home.features.items.1.title'),
      description: t('home.features.items.1.description'),
      icon: FiSmartphone,
    },
    {
      title: t('home.features.items.2.title'),
      description: t('home.features.items.2.description'),
      icon: FiBarChart,
    },
    {
      title: t('home.features.items.3.title'),
      description: t('home.features.items.3.description'),
      icon: FiUsers,
    },
  ];

  const categories = [
    {
      title: t('home.categories.items.0.title'),
      description: t('home.categories.items.0.description'),
      image: studentImage,
    },
    {
      title: t('home.categories.items.1.title'),
      description: t('home.categories.items.1.description'),
      image: teacherImage,
    },
    {
      title: t('home.categories.items.2.title'),
      description: t('home.categories.items.2.description'),
      image: institutionImage,
    },
  ];

  const roadmap = [
    {
      icon: FiCalendar,
      title: t('home.roadmap.items.0.title'),
      description: t('home.roadmap.items.0.description'),
    },
    {
      icon: FiGlobe,
      title: t('home.roadmap.items.1.title'),
      description: t('home.roadmap.items.1.description'),
    },
    {
      icon: FiCheck,
      title: t('home.roadmap.items.2.title'),
      description: t('home.roadmap.items.2.description'),
    },
    {
      icon: FiArrowRight,
      title: t('home.roadmap.items.3.title'),
      description: t('home.roadmap.items.3.description'),
    },
  ];

  const testimonials = [
    {
      quote: t('home.testimonials.items.0.quote'),
      name: t('home.testimonials.items.0.name'),
      role: t('home.testimonials.items.0.role'),
    },
    {
      quote: t('home.testimonials.items.1.quote'),
      name: t('home.testimonials.items.1.name'),
      role: t('home.testimonials.items.1.role'),
    },
  ];

  const faqs = [
    {
      question: t('home.faq.items.0.question'),
      answer: t('home.faq.items.0.answer'),
    },
    {
      question: t('home.faq.items.1.question'),
      answer: t('home.faq.items.1.answer'),
    },
    {
      question: t('home.faq.items.2.question'),
      answer: t('home.faq.items.2.answer'),
    },
  ];

  return (
    <>
      <section
        id="hero"
        className={`relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-950 text-white'
            : 'bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900'
        }`}
      >
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Professionals collaborating during an election"
            className="h-full w-full object-cover opacity-35"
          />
          <div className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950'
              : 'bg-gradient-to-br from-blue-50/80 via-white/90 to-blue-50/80'
          }`} />
        </div>

        <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col gap-16 px-4 pb-24 pt-32 sm:px-6 md:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide backdrop-blur ${
              theme === 'dark'
                ? 'border-white/10 bg-white/5 text-sky-200'
                : 'border-gray-200 bg-white/80 text-blue-600'
            }`}>
              <span className={`inline-flex h-2 w-2 rounded-full ${
                theme === 'dark' ? 'bg-emerald-400' : 'bg-green-500'
              }`} />
              {t('home.hero.badge')}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
              </button>
              <div className={`flex items-center gap-3 text-xs sm:text-sm ${
                theme === 'dark' ? 'text-slate-200' : 'text-gray-600'
              }`}>
                <div className="flex items-center gap-2">
                  <FiShield className={`${
                    theme === 'dark' ? 'text-emerald-400' : 'text-green-500'
                  }`} />
                  {t('home.hero.isoCompliant')}
                </div>
                <div className={`hidden h-4 w-px sm:block ${
                  theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                }`} />
                <div className="flex items-center gap-2">
                  <FiGlobe className={`${
                    theme === 'dark' ? 'text-emerald-400' : 'text-green-500'
                  }`} />
                  {t('home.hero.globalResidency')}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr] lg:items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className={`text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('home.hero.title')}
                </h1>
                <p className={`max-w-2xl text-base sm:text-lg md:text-xl ${
                  theme === 'dark' ? 'text-slate-200' : 'text-gray-600'
                }`}>
                  {t('home.hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition ${
                    theme === 'dark'
                      ? 'bg-sky-500 shadow-sky-500/30 hover:bg-sky-400'
                      : 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700'
                  }`}
                >
                  {t('home.hero.launchElection')}
                  <FiArrowRight className="ml-2 text-lg" />
                </Link>
                <Link
                  to="/login"
                  className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition ${
                    theme === 'dark'
                      ? 'border-white/15 text-white hover:bg-white/10'
                      : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {t('home.hero.viewConsole')}
                </Link>
              </div>

              <div className={`flex flex-wrap items-center gap-6 text-xs sm:text-sm ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
              }`}>
                <div className="flex items-center gap-2">
                  <FiCheck className={`${
                    theme === 'dark' ? 'text-emerald-400' : 'text-green-500'
                  }`} />
                  {t('home.hero.biometric')}
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className={`${
                    theme === 'dark' ? 'text-emerald-400' : 'text-green-500'
                  }`} />
                  {t('home.hero.auditable')}
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className={`${
                    theme === 'dark' ? 'text-emerald-400' : 'text-green-500'
                  }`} />
                  {t('home.hero.sso')}
                </div>
              </div>
            </div>

            <div className={`hidden h-full rounded-3xl border p-8 shadow-2xl backdrop-blur lg:flex lg:flex-col lg:justify-between ${
              theme === 'dark'
                ? 'border-white/10 bg-white/5 shadow-sky-500/5'
                : 'border-gray-200 bg-white/90 shadow-blue-500/10'
            }`}>
              <div className="space-y-3">
                <p className={`text-xs uppercase tracking-[0.2em] ${
                  theme === 'dark' ? 'text-sky-200' : 'text-blue-600'
                }`}>
                  {t('home.hero.milestone')}
                </p>
                <h2 className={`text-2xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('home.hero.awards')}
                </h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-slate-200' : 'text-gray-600'
                }`}>
                  {t('home.hero.description')}
                </p>
              </div>
              <div className="space-y-4">
                <div className={`rounded-2xl border p-4 text-sm ${
                  theme === 'dark'
                    ? 'border-white/10 bg-white/10'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className={`flex items-center justify-between text-xs ${
                    theme === 'dark' ? 'text-slate-200' : 'text-gray-600'
                  }`}>
                    <span>{t('home.hero.votingWindow')}</span>
                    <span className={`${
                      theme === 'dark' ? 'text-emerald-300' : 'text-green-600'
                    }`}>{t('home.hero.live')}</span>
                  </div>
                  <p className={`mt-2 text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('home.hero.dates')}
                  </p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-slate-300' : 'text-gray-500'
                  }`}>
                    {t('home.hero.participants')}
                  </p>
                </div>
                <img
                  src={voteImage}
                  alt="Choosify dashboard preview"
                  className="w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-16 ${
        theme === 'dark'
          ? 'bg-slate-900/95 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:px-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border p-6 text-center shadow-sm ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <p className="text-3xl font-bold sm:text-4xl">{stat.value}</p>
              <p className={`mt-3 text-sm ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
              }`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className={`py-20 ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 md:px-12">
          <div className="max-w-2xl space-y-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              theme === 'dark'
                ? 'bg-sky-900/50 text-sky-300'
                : 'bg-blue-100 text-blue-600'
            }`}>
              {t('home.features.section')}
            </span>
            <h2 className={`text-3xl font-bold sm:text-4xl ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t('home.features.title')}
            </h2>
            <p className={`text-base sm:text-lg ${
              theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
            }`}>
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className={`group rounded-3xl border p-8 transition hover:-translate-y-1 hover:shadow-xl ${
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-800/60 hover:border-sky-400 hover:bg-slate-800'
                      : 'border-slate-100 bg-slate-50/60 hover:border-blue-300 hover:bg-white'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    theme === 'dark'
                      ? 'bg-sky-500/20 text-sky-400'
                      : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className={`mt-6 text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`mt-3 text-sm sm:text-base ${
                    theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="categories" className={`py-20 ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-gray-900'
      }`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 md:px-12">
          <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
            theme === 'dark' ? 'text-white' : 'text-white'
          }`}>
            <div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                theme === 'dark'
                  ? 'bg-white/10 text-sky-200'
                  : 'bg-white/20 text-blue-200'
              }`}>
                {t('home.categories.section')}
              </span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                {t('home.categories.title')}
              </h2>
            </div>
            <p className={`max-w-xl text-sm sm:text-base ${
              theme === 'dark' ? 'text-slate-200' : 'text-gray-200'
            }`}>
              {t('home.categories.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category.title}
                className={`group overflow-hidden rounded-3xl border ${
                  theme === 'dark'
                    ? 'border-white/5 bg-white/5'
                    : 'border-white/10 bg-white/10'
                }`}
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-t from-slate-950/80 via-slate-900/40'
                      : 'bg-gradient-to-t from-gray-900/80 via-gray-800/40'
                  }`} />
                </div>
                <div className="space-y-3 p-6">
                  <h3 className="text-lg font-semibold text-white">
                    {category.title}
                  </h3>
                  <p className="text-sm text-slate-200">
                    {category.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap" className={`py-20 ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 md:px-12">
          <div className="max-w-2xl space-y-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              theme === 'dark'
                ? 'bg-emerald-900/50 text-emerald-300'
                : 'bg-green-50 text-green-600'
            }`}>
              {t('home.roadmap.section')}
            </span>
            <h2 className={`text-3xl font-bold sm:text-4xl ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t('home.roadmap.title')}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {roadmap.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className={`rounded-3xl border p-8 transition hover:shadow-lg ${
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-800/60 hover:border-emerald-400 hover:bg-slate-800'
                      : 'border-slate-100 bg-slate-50/60 hover:border-green-300 hover:bg-white'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    theme === 'dark'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className={`mt-6 text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`mt-3 text-sm sm:text-base ${
                    theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="testimonials" className={`py-20 ${
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
      }`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 md:px-12">
          <div className="max-w-2xl space-y-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              theme === 'dark'
                ? 'bg-slate-700 text-slate-300'
                : 'bg-white text-gray-500'
            }`}>
              {t('home.testimonials.section')}
            </span>
            <h2 className={`text-3xl font-bold sm:text-4xl ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t('home.testimonials.title')}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className={`rounded-3xl border p-8 shadow-sm ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <p className={`text-base sm:text-lg ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  “{testimonial.quote}”
                </p>
                <div className="mt-6">
                  <p className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>{testimonial.name}</p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className={`py-20 ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 sm:px-6 md:px-12">
          <div className="text-center space-y-4">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-tight ${
              theme === 'dark'
                ? 'bg-sky-900/50 text-sky-300'
                : 'bg-sky-100 text-sky-600'
            }`}>
              {t('home.faq.section')}
            </span>
            <h2 className={`text-3xl font-bold sm:text-4xl ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {t('home.faq.title')}
            </h2>
            <p className={`text-sm sm:text-base ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {t('home.faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className={`group rounded-3xl border p-6 ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800/60'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <summary className={`flex cursor-pointer items-center justify-between text-left text-base font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {faq.question}
                  <span className={`ml-4 transition group-open:rotate-45 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
                  }`}>
                    <FiPlusIcon />
                  </span>
                </summary>
                <p className={`mt-4 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className={`relative overflow-hidden py-20 ${
        theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-900 text-white'
      }`}>
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Celebratory voters"
            className="h-full w-full object-cover opacity-20"
          />
          <div className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-900 via-sky-900/60 to-slate-950'
              : 'bg-gradient-to-br from-slate-900 via-sky-900/60 to-slate-950'
          }`} />
        </div>
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6 md:px-12">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-200">
              {t('home.cta.section')}
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl">
            {t('home.cta.title')}
          </h2>
          <p className="max-w-2xl text-sm text-slate-200 sm:text-base">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
            >
              {t('home.cta.createAccount')}
            </Link>
            <a
              href="https://www.linkedin.com/in/ayuk-giress-077734294/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BjucQuBkgSmOUVQxCm%2B4d3Q%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t('home.cta.talkExpert')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

const FiPlusIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 0 1 0-2h5V4a1 1 0 0 1 1-1Z"
      clipRule="evenodd"
    />
  </svg>
);

export default HomePage;