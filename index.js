const express = require('express');
const app = express();
const {graphqlHTTP} = require('express-graphql');
const  {buildSchema } = require('graphql'); /* cómo va a lucir los datos */
/* Data */

const {courses} = require('./data.json');
/* console.log(courses); */
/* Va a poder consultar message y es de tipo String */
/* ! para obligatorio */
/* Es un poco parecido a Typescript porque pide los tipos de datos y el type Course podría ser como una interfaz de tsc */
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        description: String
        author: String
        topic: String
        url: String
    }
`);

let getCourse = (args) => {
    let id = args.id;
    /* va a recorrer objeto por objeto y va a comparar */
    return courses.filter(course => {
        return course.id == id;
    })[0]; /* Para obtener el primer dato */
}

let getCourses = (args) => {
    if(args.topic) {
        let topic = args.topic;
        return courses.filter(course => course.topic === topic);
    } else{
        return courses;
    }
}

let updateCourseTopic = ({id, topic}) => {
    courses.map(course => {
        if(course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return courses.filter(course => course.id === id)[0]
}

const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};


app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


app.listen(3000, () => console.log('running on port 3000'));


/* QUERYS DE LA INTERFAZ DE GRAPHQL */
/* query getSingleCourse($courseID: Int!) {
  course(id: $courseID) {
    id
    title
    author
    description
    topic
    url
  }
}
 */
/* query variables */
 /* {
  "courseID": 1
} */

/* query getCourses($courseTopic: String) {
  courses(topic: $courseTopic) {
    id
    title
    author
    description
    topic
    url
  }
}
 */

 /* query variables */
 /* {
  "courseTopic": "Javascript"
} */



/* Para actualizar */
/* 
mutation updateCourseTopic($id: Int!, $topic: String!) {
  updateCourseTopic(id: $id, topic: $topic) {
    ...courseFields
  }
}

fragment courseFields on Course {
  id
  title
  author
  description
  topic
  url
} */