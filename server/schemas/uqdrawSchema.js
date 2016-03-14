import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLInputObjectType,
} from 'graphql';

const questionData = require('../data/questionsData.js');
const userData = require('../data/usersData.js');
const courseData = require('../data/courseData.js');
const lectureData = require('../data/lectureData.js');
const presentationData = require('../data/presentationData.js');
const responseData = require('../data/responseData.js');

// -----------------------------------------------------------------------------
// USER
// -----------------------------------------------------------------------------
const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A register user',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the user.',
    },
    username: {
      type: GraphQLString,
      description: `The user's username`,
    },
    courses: {
      type: new GraphQLList(courseType),
      description: `The courses that the user teaches`,
      resolve: user => courseData.getCoursesByUser(user)
    }
  })
});


// -----------------------------------------------------------------------------
// COURSE
// -----------------------------------------------------------------------------
const courseType = new GraphQLObjectType({
  name: `Course`,
  description: `A course/subject that a presenter teaches`,
  fields: () => ({
    id: {
      type: GraphQLString,
      description: `The course's id`,
    },
    name: {
      type: GraphQLString,
      description: `The name of the course/subject`,
    },
    userOwner: {
      type: userType,
      description: `The presenter that created the course`,
      resolve: course => courseData.getOwner(course)
    },
    lectures: {
      type: new GraphQLList(lectureType),
      description: `Added lectures for the course`,
      resolve: course => lectureData.getLecturesByCourse(course)
    }
  })
});


// -----------------------------------------------------------------------------
// LECTURE
// -----------------------------------------------------------------------------
const lectureType = new GraphQLObjectType({
  name: 'Lecture',
  description: 'A particular lecture that the presenter will present',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: `The lecture's id`,
    },
    name: {
      type: GraphQLString,
      description: `The name for the lecture`,
    },
    questions: {
      type: new GraphQLList(questionType),
      description: `A list of questions to present for the lecture`,
      resolve: lecture => questionData.getQuestionsByLecture(lecture)
    },
    courseOwner: {
      type: courseType,
      description: `The course of which the lecture is a part`,
      resolve: lecture => lectureData.getOwner(lecture)
    }
  })
})


// -----------------------------------------------------------------------------
// Question
// -----------------------------------------------------------------------------
const questionType = new GraphQLObjectType({
  name: 'Question',
  description: 'A question added by a presenter.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the question.',
    },
    text: {
      type: GraphQLString,
      description: 'The text content of the question.',
    },
    lectureOwner: {
      type: lectureType,
      description: 'The lecture to which the question belongs.',
      resolve: question => questionData.getOwner(question)
    },
    listPosition: {
      type: GraphQLInt,
      description: `The position in the lectureOwners's list of questions`
    }
  })
});

const presentationQuestionType = new GraphQLObjectType({
  name: 'PresentationQuestion',
  description: 'A question presented during a presentation',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the question.',
    },
    text: {
      type: GraphQLString,
      description: 'The text content of the question.',
    },
    listPosition: {
      type: GraphQLInt,
      description: `The position in question list for the presentation`,
    }
  })
});


// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------
const presentationType = new GraphQLObjectType({
  name: 'Presentation',
  description: 'A presentation of a lecture at a particular point in time',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: `The presentation's id`,
    },
    lectureName: {
      type: GraphQLString,
      description: `A copy of the lecture name at presentation launch time`
    },
    startedAt: {
      type: GraphQLInt,
      description: 'Time that the presentation began in Unix time',
    },
    isActive: {
      type: GraphQLBoolean,
      description: `Is the presentation currently occurring`,
    },
    code: {
      type: GraphQLString,
      description: `The presentation code used by students to access the presentation`,
    },
    currentQuestion: {
      type: presentationQuestionType,
      description: `The question being displayed by the presentation`,
      resolve: presentation => presentationData.getCurrentQuestion(presentation)
    },
    questions: {
      type: new GraphQLList(presentationQuestionType),
      description: `Questions to be presented during the presentation`,
      resolve: presentation => presentationData.getQuestions(presentation),
    },
    isAcceptingResponses: {
      type: GraphQLBoolean,
      description: `Is the current question currently accepting responses?`
    },
    responses: {
      type: new GraphQLList(responseType),
      args: {
        questionId: {
          type: GraphQLString,
          description: `Filters the responses for the presentation to only
                        contain responses to this particular question`,
        }
      },
      description: `Responses received during the presentation`,
      resolve: (presentation, args) =>
        responseData.getResponsesByPresentation(presentation, args.questionId)
    }
  })
});

const presentationQueryInput = new GraphQLInputObjectType({
  name: `presentationQueryInput`,
  fields: {
    id: { type: GraphQLString },
    code: { type: GraphQLString },
  }
});


// -----------------------------------------------------------------------------
// Response
// -----------------------------------------------------------------------------
const responseType = new GraphQLObjectType({
  name: `Response`,
  description: `A response to a question posed during a presentation`,
  fields: () => ({
    id: {
      type: GraphQLString,
      description: `The response's id`
    },
    question: {
      type: questionType,
      description: `The question which the response was in response to`,
      resolve: response => responseData.getQuestionRespondingTo(response)
    },
    presentation: {
      type: presentationType,
      description: `The presentation in which the repsonse was submitted`,
      resolve: response => responseData.getPresentation(response)
    },
    responseUri: {
      type: GraphQLString,
      description: `URI of the canvas snapshot submitted as a reponse`,
    },
  })
});

// -----------------------------------------------------------------------------
//  QUERY
//  ----------------------------------------------------------------------------
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      args: {
        id: {
          description: 'id of the user',
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve: (_, args) => userData.getUser(args.id)
    },
    course: {
      type: courseType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, args) => courseData.getCourse(args.id)
    },
    question: {
      type: questionType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, args) => questionData.getQuestion(args.id)
    },
    response: {
      type: responseType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, args) => responseData.getResponse(args.id)
    },
    presentation: {
      type: presentationType,
      args: {
        input: { type: presentationQueryInput }
        // id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, { input }) =>
        input.id ? presentationData.getPresentation(input.id)
                : presentationData.getPresentationByCode(input.code)
    },

  }
});


// -----------------------------------------------------------------------------
//  MUTATION
//  ----------------------------------------------------------------------------
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: userType,
      args: {
        id: { type: GraphQLString },
        username: { type: GraphQLString },
      },
      resolve: (_, args) => userData.addUser(args.id, args.username),
    },
    addCourse: {
      type: courseType,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        userOwner: { type: GraphQLString },
      },
      resolve: (_, args) => courseData.addCourse(args.id, args.name, args.userOwner)
    },
    addLecture: {
      type: lectureType,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        courseOwner: { type: GraphQLString },
      },
      resolve: (_, args) => lectureData.addLecture(args.id, args.name, args.courseOwner)
    },
    deleteLecture: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (_, args) => lectureData.deleteLecture(args.id)
    },
    addQuestion: {
      type: questionType,
      args: {
        id: { type: GraphQLString },
        text: { type: GraphQLString },
        lectureOwner: { type: GraphQLString },
        listPosition: { type: GraphQLInt },
      },
      resolve: (_, args) => questionData.addQuestion(args.id, args.text, args.lectureOwner, args.listPosition),
    },
    deleteQuestion: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, args) => questionData.deleteQuestion(args.id)
    },
    addResponse: {
      type: responseType,
      args: {
        id: { type: GraphQLString },
        question: { type: GraphQLString },
        presentation: { type: GraphQLString },
        response: { type: GraphQLString },
      },
      resolve: (_, args) => responseData.addResponse(args.id, args.question, args.presentation, args.responseUri)
    },
    addPresentation: {
      type: presentationType,
      args: {
        id: { type: GraphQLString },
        lectureId: { type: GraphQLString },
      },
      resolve: (_, args) => presentationData.addPresentation(args.id, args.lectureId)
    },
    activateQuestion: {
      type: GraphQLBoolean,
      args: {
        presentationId: { type: new GraphQLNonNull(GraphQLString) },
        questionId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { presentationId, questionId }) =>
        presentationData.activateQuestion(presentationId, questionId),
    },
    updateResponseAcceptance: {
      type: GraphQLBoolean,
      args: {
        presentationId: { type: new GraphQLNonNull(GraphQLString) },
        isAcceptingResponses: { type: GraphQLBoolean },
      },
      resolve: (_, args) => presentationData.updateResponseAcceptance(
        args.presentationId, args.isAcceptingResponses),
    },
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

module.exports = schema;
