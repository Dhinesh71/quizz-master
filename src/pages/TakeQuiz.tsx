import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Quiz, Question } from '../types/database';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle, Clock, AlertCircle, User, Mail, Phone, Hash } from 'lucide-react';

const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  // Student info
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentRegisterNumber, setStudentRegisterNumber] = useState('');

  // Quiz answers
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    try {
      // Fetch quiz (accessible to anonymous users if active and within time bounds)
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (quizError) {
        if (quizError.code === 'PGRST116') {
          setError('Quiz not found or not accessible at this time.');
        } else {
          setError('Failed to load quiz. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Check if quiz is accessible
      if (!quizData.is_active) {
        setError('This quiz is currently inactive.');
        setLoading(false);
        return;
      }

      const now = new Date();
      if (quizData.valid_from && new Date(quizData.valid_from) > now) {
        setError(`This quiz will be available from ${new Date(quizData.valid_from).toLocaleString()}.`);
        setLoading(false);
        return;
      }

      if (quizData.valid_until && new Date(quizData.valid_until) < now) {
        setError(`This quiz was available until ${new Date(quizData.valid_until).toLocaleString()}.`);
        setLoading(false);
        return;
      }

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', id)
        .order('order_index');

      if (questionsError) {
        setError('Failed to load quiz questions. Please try again.');
        setLoading(false);
        return;
      }

      setQuiz(quizData);
      setQuestions(questionsData);
      setAnswers(new Array(questionsData.length).fill(''));
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const validateForm = () => {
    if (!studentName.trim()) {
      alert('Please enter your name');
      return false;
    }
    if (!studentEmail.trim()) {
      alert('Please enter your email');
      return false;
    }
    if (!studentPhone.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    if (!studentRegisterNumber.trim()) {
      alert('Please enter your register number');
      return false;
    }

    // Check if all questions are answered
    for (let i = 0; i < questions.length; i++) {
      if (!answers[i]) {
        alert(`Please answer question ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (answers[index] === question.correct_answer) {
          correctAnswers++;
        }
      });

      // Submit response
      const { error } = await supabase
        .from('responses')
        .insert({
          quiz_id: id!,
          student_name: studentName.trim(),
          student_email: studentEmail.trim(),
          student_phone: studentPhone.trim(),
          student_register_number: studentRegisterNumber.trim(),
          answers,
          score: correctAnswers,
          total_questions: questions.length
        });

      if (error) throw error;

      setScore(correctAnswers);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Available</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Submitted!</h1>
          <p className="text-gray-600 mb-4">Thank you for taking the quiz.</p>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Results</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Score:</span>
                <span className="font-medium">{score}/{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Percentage:</span>
                <span className={`font-medium ${
                  percentage >= 80 ? 'text-green-600' : 
                  percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Your response has been recorded. You can close this page now.
          </p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Quiz not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{quiz.description}</p>
          )}
          
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{questions.length} questions</span>
            </div>
            {quiz.valid_until && (
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Available until {new Date(quiz.valid_until).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="h-4 w-4 inline mr-1" />
                  Register Number *
                </label>
                <input
                  type="text"
                  value={studentRegisterNumber}
                  onChange={(e) => setStudentRegisterNumber(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your register number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {index + 1}. {question.question_text}
                </h3>
                
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => handleAnswerChange(index, option)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        required
                      />
                      <span className="ml-3 text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {submitting ? (
                <LoadingSpinner size="small" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeQuiz;