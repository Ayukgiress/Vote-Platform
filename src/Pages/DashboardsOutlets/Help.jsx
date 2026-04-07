import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, Book, Video, Mail, Sparkles, Zap, LifeBuoy, ExternalLink, Star } from 'lucide-react';
import { useTheme } from '../Contexts/ThemeContext';

const Help = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: 'How do I create a new contest?',
      answer: 'To create a new contest, go to the Overview page and click the "Create Contest" button. Fill in the contest details including name, description, start and end dates, then add contestants to get started.',
      category: 'Getting Started'
    },
    {
      question: 'How do I publish a contest?',
      answer: 'Once your contest has at least one contestant, you can publish it by clicking the "Publish" button on the contest card. Published contests become visible to voters through their unique voting URL.',
      category: 'Contest Management'
    },
    {
      question: 'Can I edit a contest after it\'s published?',
      answer: 'You can edit basic contest information, but you cannot modify contestants or voting settings after publication. For major changes, consider creating a new contest.',
      category: 'Contest Management'
    },
    {
      question: 'How do voters access the contest?',
      answer: 'After publishing, each contest gets a unique voting URL (e.g., yoursite.com/contest-id/vote). Share this URL with your audience to allow them to vote.',
      category: 'Voting'
    },
    {
      question: 'What happens when a contest ends?',
      answer: 'When the end date passes, voting is automatically disabled. Winners are calculated based on the highest number of votes. You can view results on the contest card.',
      category: 'Results & Analytics'
    },
    {
      question: 'Can I export contest data?',
      answer: 'Yes, you can export analytics data from the Analytics page. Click the "Export" button to download a CSV file with your contest statistics.',
      category: 'Results & Analytics'
    },
    {
      question: 'How do I add contestants to a contest?',
      answer: 'On the contest card, click "Add Contestant". Upload contestant photos and enter their names. You can add multiple contestants before publishing.',
      category: 'Contest Management'
    },
    {
      question: 'Is there a limit to the number of contests I can create?',
      answer: 'There are no hard limits on the number of contests you can create. However, we recommend keeping your active contests manageable for optimal performance.',
      category: 'Account & Limits'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const quickActions = [
    {
      icon: <Book className="h-6 w-6" />,
      title: 'Documentation',
      description: 'Complete user guide and API documentation',
      action: () => window.open('https://docs.Choosify.com', '_blank'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      action: () => window.open('https://youtube.com/Choosify', '_blank'),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Community Forum',
      description: 'Get help from other users and experts',
      action: () => window.open('https://community.Choosify.com', '_blank'),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Contact Support',
      description: 'Send us a message for personalized help',
      action: () => window.location.href = 'mailto:support@Choosify.com',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="space-y-8">
        {/* Header */}
        {/* <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-24 h-24 mx-auto flex items-center justify-center shadow-xl">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about Choosify. Find answers, watch tutorials, and get support.
            </p>
          </div>
        </div> */}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className={`rounded-2xl shadow-lg border p-6 cursor-pointer transition hover:-translate-y-1 hover:shadow-xl ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
                  : 'bg-white border-slate-200/60 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-sky-500/20' : 'bg-blue-100'
                }`}>
                  <div className={`text-white bg-gradient-to-br ${action.color} rounded-lg p-2`}>
                    {action.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-800'
                  }`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-3 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {action.description}
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span>Learn more</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Section */}
        <div className={`rounded-2xl shadow-lg border p-8 transition hover:-translate-y-1 hover:shadow-xl ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
            : 'bg-white border-slate-200/60 hover:border-blue-300'
        }`}>
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className={`flex items-center justify-center gap-2 mb-4 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <Zap className={`h-5 w-5 ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
              }`} />
              <span className="text-sm font-medium">Popular: Contest Creation, Voting Setup, Results</span>
            </div>
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search help articles, FAQs, and guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
            </div>
            {searchTerm && (
              <p className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className={`rounded-2xl shadow-lg border p-8 transition hover:-translate-y-1 hover:shadow-xl ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
            : 'bg-white border-slate-200/60 hover:border-blue-300'
        }`}>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-sky-500/20' : 'bg-blue-50'
            }`}>
              <LifeBuoy className={`h-6 w-6 ${
                theme === 'dark' ? 'text-sky-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              }`}>Frequently Asked Questions</h2>
              <p className={`mt-1 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Quick answers to common questions</p>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSearchTerm('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                searchTerm === ''
                  ? 'bg-blue-500 text-white shadow-lg'
                  : theme === 'dark'
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  searchTerm === category
                    ? 'bg-blue-500 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-xl transition-all duration-200 overflow-hidden group ${
                  theme === 'dark'
                    ? 'border-slate-600 hover:border-slate-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full px-6 py-5 text-left flex items-center justify-between transition-colors duration-200 group ${
                    theme === 'dark'
                      ? 'hover:bg-slate-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg mt-1 transition-colors ${
                      theme === 'dark'
                        ? 'bg-sky-500/20 group-hover:bg-sky-500/30'
                        : 'bg-blue-50 group-hover:bg-blue-100'
                    }`}>
                      <HelpCircle className={`h-4 w-4 ${
                        theme === 'dark' ? 'text-sky-400' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`font-semibold text-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-white group-hover:text-sky-400'
                            : 'text-gray-900 group-hover:text-blue-600'
                        }`}>
                          {faq.question}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          theme === 'dark'
                            ? 'bg-slate-600 text-slate-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {faq.category}
                        </span>
                      </div>
                      {expandedFAQ !== index && (
                        <p className={`text-sm line-clamp-1 ${
                          theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                        }`}>
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {expandedFAQ === index ? (
                      <ChevronUp className={`h-5 w-5 transform group-hover:scale-110 transition-transform ${
                        theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                      }`} />
                    ) : (
                      <ChevronDown className={`h-5 w-5 transform group-hover:scale-110 transition-transform ${
                        theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                      }`} />
                    )}
                  </div>
                </button>
                {expandedFAQ === index && (
                  <div className={`px-6 pb-5 ml-12 border-t pt-4 ${
                    theme === 'dark'
                      ? 'border-slate-600'
                      : 'border-gray-100'
                  }`}>
                    <p className={`leading-relaxed ${
                      theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                    }`}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className={`rounded-2xl p-8 max-w-md mx-auto ${
                theme === 'dark'
                  ? 'bg-slate-700/50'
                  : 'bg-gray-50'
              }`}>
                <Search className={`h-12 w-12 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                }`} />
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>No results found</h3>
                <p className={`${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  Try adjusting your search terms or browse the categories above.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className={`rounded-2xl p-10 text-center relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800 to-slate-900'
            : 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className={`backdrop-blur-sm rounded-full p-4 ${
                theme === 'dark' ? 'bg-slate-700/50' : 'bg-white/20'
              }`}>
                <MessageCircle className={`h-8 w-8 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-white'
                }`} />
              </div>
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-white'
            }`}>Still need help?</h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-slate-300' : 'text-blue-100'
            }`}>
              Our support team is ready to assist you with any questions or issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.href = 'mailto:support@Choosify.com'}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-white text-blue-600 hover:bg-gray-100'
                }`}
              >
                <Mail className="h-5 w-5" />
                Email Support Team
              </button>
              <button
                onClick={() => window.open('https://community.Choosify.com', '_blank')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 border ${
                  theme === 'dark'
                    ? 'bg-slate-600 hover:bg-slate-500 text-slate-200 border-slate-500'
                    : 'bg-blue-500 hover:bg-blue-400 text-white border-blue-400'
                }`}
              >
                <MessageCircle className="h-5 w-5" />
                Ask Community
              </button>
            </div>
            <div className={`flex items-center justify-center gap-6 mt-8 text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-current" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 fill-current" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 fill-current" />
                <span>Expert Help</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Help;