const serverAddress = 'http://localhost:8080';

import cloneDeep from 'lodash/cloneDeep';


// fetchQuery :: GraphQLQuery -> Promise<Object>
// Sends the given graphql query to the server and produces a promise
// that resolves to the response data as an object. If there is an
// error in the request, or the response is not OK, the promise is rejected
const fetchQuery = (query) => {
  return fetch(serverAddress, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/graphql'
    }),
    mode: 'cors',
    body: query,
  })
  .then(res => {
    if (!res.ok) {
      // Log any GraphQL errors
      res.json().then(payload => {
        payload.errors.forEach(error => console.error(error.message));
        console.error('Full GraphQL error response', payload);
      });
      throw new Error('HTTP Error');
    }
    return res.json()
  })
  .then(payload => {
    if (payload.errors) {
      const error = new Error('GraphQL Error');
      error.errors = payload.errors;
      console.error(payload.errors);
      throw error;
    }

    // Debugging during dev
    console.log('GraphQL payload', payload);

    return payload;
  });
}

export function fetchUser(id) {
  const query = `
    {
      user(id: "${id}") {
        courses {
          id,
          name
        }
      }
    }
  `;

  return fetchQuery(query);
}

export function createSubject(id, userId, subjectName) {
  const query = `
    mutation {
      addCourse(id: "${id}", name: "${subjectName}", userOwner: "${userId}") {
        id,
        name
      }
    }
  `;
  return fetchQuery(query);
}

export function fetchLectures(courseId) {
  const query = `
    {
      course(id: "${courseId}") {
        lectures {
          name,
          id,
          questions {
            id,
            text,
            listPosition,
            lectureOwner {
              id
            }
          },
          courseOwner {
            id
          }
        }
      }
    }
  `;
  return fetchQuery(query);
}

export function createLecture(id, name, courseOwner) {
  const query = `
    mutation {
      addLecture(id:"${id}", name: "${name}", courseOwner: "${courseOwner}") {
        id,
        name,
        courseOwner {
          id
        }
      }
    }
  `;
  return fetchQuery(query);
}

export function deleteLecture(id) {
  return fetchQuery(`
    mutation {
      deleteLecture(id: "${id}")
    }
  `);
}

export function createQuestion(id, text, lectureOwner, listPosition) {
  const query = `
    mutation {
      addQuestion(id: "${id}", text: "${text}",
        lectureOwner: "${lectureOwner}", listPosition: ${listPosition}) {
        id,
        text
      }
    }
  `;
  return fetchQuery(query);
}

export function deleteQuestion(id) {
  return fetchQuery(`
    mutation {
      deleteQuestion(id: "${id}")
    }
  `);
}

export function startPresentation(id, lectureId) {
  return fetchQuery(`
    mutation {
      presentation: addPresentation(
        id: "${id}",
        lectureId: "${lectureId}",
      ) {
        id,
        lectureName,
        startedAt,
        isActive,
        code,
        currentQuestion {
          id,
        },
        questions {
          id,
          text,
          listPosition,
        },
        isAcceptingResponses,
      }
    }
  `);
}

export function activateQuestion(presentationId, questionId) {
  return fetchQuery(`
    mutation {
      activateQuestion(presentationId: "${presentationId}", questionId:"${questionId}")
    }
  `);
}

export function updateResponseAcceptance(presentationId, isAcceptingResponses) {
  return fetchQuery(`
    mutation {
      updateResponseAcceptance(presentationId: "${presentationId}",
        isAcceptingResponses: ${isAcceptingResponses})
    }
  `);
}

export function fetchPresentationByCode(code) {
  return fetchQuery(`
    query {
      presentation(input: {
        code: "${code}"
      }) {
        id,
        code,
        currentQuestion {
          id,
          text,
        },
        isAcceptingResponses,
      }
    }
  `);
}

export function submitResponse(id, presentationId, questionId, responseImg) {
  return fetchQuery(`
    mutation {
      addResponse(id: "${id}", presentation: "${presentationId}",
        question: "${questionId}", response: "${responseImg}") {
        id
      }
    }
  `);
}
