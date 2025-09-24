import React, { useState } from 'react';
import { X, Calendar, Clock, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Quiz } from '../types/database';

interface ShareQuizModalProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedQuiz: Quiz) => void;
}

const ShareQuizModal: React.FC<ShareQuizModalProps> = ({ quiz, isOpen, onClose, onUpdate }) => {
  const [validFrom, setValidFrom] = useState(
    quiz.valid_from ? new Date(quiz.valid_from).toISOString().slice(0, 16) : ''
  );
  const [validUntil, setValidUntil] = useState(
    quiz.valid_until ? new Date(quiz.valid_until).toISOString().slice(0, 16) : ''
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const quizLink = `${window.location.origin}/quiz/${quiz.id}`;

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates: any = {
        valid_from: validFrom ? new Date(validFrom).toISOString() : null,
        valid_until: validUntil ? new Date(validUntil).toISOString() : null,
      };

      // Validate dates
      if (validFrom && validUntil && new Date(validFrom) >= new Date(validUntil)) {
        alert('End date must be after start date');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('quizzes')
        .update(updates)
        .eq('id', quiz.id)
        .select()
        .single();

      if (error) throw error;

      onUpdate(data);
      copyToClipboard();
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Failed to update quiz settings');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quizLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const clearDates = () => {
    setValidFrom('');
    setValidUntil('');
  };

  const isAlwaysValid = !validFrom && !validUntil;
  const isCurrentlyValid = () => {
    const now = new Date();
    const fromDate = validFrom ? new Date(validFrom) : null;
    const untilDate = validUntil ? new Date(validUntil) : null;
    
    if (!fromDate && !untilDate) return true;
    if (fromDate && now < fromDate) return false;
    if (untilDate && now > untilDate) return false;
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Share Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quiz Info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{quiz.title}</h3>
            <p className="text-sm text-gray-600">
              Set the time period when this quiz will be accessible to students.
            </p>
          </div>

          {/* Time Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Time Validity</h4>
              <button
                onClick={clearDates}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Always Valid
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Available From (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Available Until (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Status Indicator */}
            <div className={`p-3 rounded-lg border ${
              isCurrentlyValid() 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isCurrentlyValid() ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-sm font-medium ${
                  isCurrentlyValid() ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isAlwaysValid 
                    ? 'Always accessible' 
                    : isCurrentlyValid() 
                      ? 'Currently accessible' 
                      : 'Not currently accessible'
                  }
                </span>
              </div>
              {!isAlwaysValid && (
                <p className={`text-xs mt-1 ${
                  isCurrentlyValid() ? 'text-green-600' : 'text-red-600'
                }`}>
                  {validFrom && `From: ${new Date(validFrom).toLocaleString()}`}
                  {validFrom && validUntil && ' • '}
                  {validUntil && `Until: ${new Date(validUntil).toLocaleString()}`}
                </p>
              )}
            </div>
          </div>

          {/* Quiz Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={quizLink}
                readOnly
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Saving...' : 'Save & Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareQuizModal;