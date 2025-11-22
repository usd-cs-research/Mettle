const mongoose = require('mongoose');

// Connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/mettle', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});

// Define schemas (copy from your models)
const sessionSchema = new mongoose.Schema({
  sessionId: String,
  participants: [String],
  createdAt: Date
});

const questionSchema = new mongoose.Schema({
  sessionId: String,
  question: String,
  createdAt: Date
});

const answerSchema = new mongoose.Schema({
  sessionId: String,
  questionId: String,
  userId: String,
  answer: String,
  createdAt: Date
});

const Session = mongoose.model('Session', sessionSchema);
const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);

// Mock data
const mockData = {
  sessions: [
    {
      sessionId: 'session-001',
      participants: ['user1', 'user2'],
      createdAt: new Date()
    }
  ],
  questions: [
    {
      sessionId: 'session-001',
      question: 'What is the capital of France?',
      createdAt: new Date()
    }
  ],
  answers: [
    {
      sessionId: 'session-001',
      questionId: 'question-001', // Assume ID
      userId: 'user1',
      answer: 'Paris',
      createdAt: new Date()
    },
    {
      sessionId: 'session-001',
      questionId: 'question-001',
      userId: 'user2',
      answer: 'London',
      createdAt: new Date()
    }
  ]
};

async function populate() {
  try {
    // Clear existing data
    await Session.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});

    // Insert mock data
    const session = await Session.create(mockData.sessions[0]);
    const question = await Question.create({
      ...mockData.questions[0],
      _id: 'question-001' // Set ID
    });

    await Answer.create({
      ...mockData.answers[0],
      questionId: question._id
    });
    await Answer.create({
      ...mockData.answers[1],
      questionId: question._id
    });

    console.log('Mock data inserted successfully');
    console.log('Session ID:', session.sessionId);
    console.log('Question ID:', question._id);
  } catch (error) {
    console.error('Error inserting mock data:', error);
  } finally {
    mongoose.connection.close();
  }
}

populate();