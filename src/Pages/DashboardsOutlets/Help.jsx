import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, Book, Video, Mail } from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: 'How do I create a new contest?',
      answer: 'To create a new contest, go to the Overview page and click the "Create Contest" button. Fill in the contest details including name, description, start and end dates, then add contestants to get started.'
    },
    {
      question: 'How do I publish a contest?',
      answer: 'Once your contest has at least one contestant, you can publish it by clicking the "Publish" button on the contest card. Published contests become visible to voters through their unique voting URL.'
    },
    {
      question: 'Can I edit a contest after it\'s published?',
      answer: 'You can edit basic contest information, but you cannot modify contestants or voting settings after publication. For major changes, consider creating a new contest.'
    },
    {
      question: 'How do voters access the contest?',
      answer: 'After publishing, each contest gets a unique voting URL (e.g., yoursite.com/contest-id/vote). Share this URL with your audience to allow them to vote.'
    },
    {
      question: 'What happens when a contest ends?',
      answer: 'When the end date passes, voting is automatically disabled. Winners are calculated based on the highest number of votes. You can view results on the contest card.'
    },
    {
      question: 'Can I export contest data?',
      answer: 'Yes, you can export analytics data from the Analytics page. Click the "Export" button to download a CSV file with your contest statistics.'
    },
    {
      question: 'How do I add contestants to a contest?',
      answer: 'On the contest card, click "Add Contestant". Upload contestant photos and enter their names. You can add multiple contestants before publishing.'
    },
    {
      question: 'Is there a limit to the number of contests I can create?',
      answer: 'There are no hard limits on the number of contests you can create. However, we recommend keeping your active contests manageable for optimal performance.'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const quickActions = [
    {
      icon: <Book className="h-6 w-6" />,
      title: 'Documentation',
      description: 'Complete user guide and API documentation',
      action: () => window.open('https://docs.votehub.com', '_blank')
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      action: () => window.open('https://youtube.com/votehub', '_blank')
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Community Forum',
      description: 'Get help from other users and experts',
      action: () => window.open('https://community.votehub.com', '_blank')
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Contact Support',
      description: 'Send us a message for personalized help',
      action: () => window.location.href = 'mailto:support@votehub.com'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <HelpCircle className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Help Center
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions, access documentation, and get support for VoteHub
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <div
            key={index}
            onClick={action.action}
            className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-6 cursor-pointer hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
          >
            <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
              <div className="text-blue-600">{action.icon}</div>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">{action.title}</h3>
            <p className="text-sm text-slate-600">{action.description}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-slate-800">{faq.question}</span>
                {expandedFAQ === index ? (
                  <ChevronUp className="h-5 w-5 text-slate-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-500" />
                )}
              </button>
              {expandedFAQ === index && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-600">No FAQs found matching your search.</p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
        <p className="mb-6 opacity-90">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.href = 'mailto:support@votehub.com'}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="h-5 w-5" />
            Email Support
          </button>
          <button
            onClick={() => window.open('https://community.votehub.com', '_blank')}
            className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Community Forum
          </button>
        </div>
      </div>
    </div>
  );
};

export default Help;
