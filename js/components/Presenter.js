import React from 'react';
import { Button } from './UI';

import QuestionSelector from './QuestionSelector.js';
import PresenterQuestion from './PresenterQuestion.js';
import PresenterResponses from './PresenterResponses.js';
import Timer from './Timer.js';

import LectureStore from '../stores/LectureStore.js';
import QuestionStore from '../stores/QuestionStore.js';
import PresentationStore from '../stores/PresentationStore.js';

import ComponentKey from '../utils/ComponentKey.js';
import API, {APIConstants} from '../utils/API.js';

require('../../css/components/Presenter.scss');

class Presenter extends React.Component {

  constructor(props) {
    super(props);
    props.onChangeCourse(null, props.routeParams.courseName);
    this.componentKey = ComponentKey.generate();
    this.state = {
      activeQuestionKey: undefined,
      responses: [],
      courseId: undefined,
      lecture: {},
      questions: {},
    };

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);

    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
    this.onQuestionChange = this.onQuestionChange.bind(this);
    this.onPresentationChange = this.onPresentationChange.bind(this);
  }

  componentDidMount() {
    // Listen for store changes
    LectureStore.addChangeListener(this.onLectureChange);
    QuestionStore.addChangeListener(this.onQuestionChange);
    PresentationStore.addChangeListener(this.onPresentationChange);
    this.initData(this.props.courseId);
  }

  componentWillReceiveProps(newProps) {
    this.initData(newProps.courseId);
  }

  componentWillUnmount() {
    let lectureKey = this.props.routeParams.lectureId;
    LectureStore.removeChangeListener(this.onLectureChange);
    QuestionStore.removeChangeListener(this.onQuestionChange);
    PresentationStore.removeChangeListener(this.onPresentationChange);
    API.unsubscribe(APIConstants.lectures, this.componentKey, this.props.courseId);
    API.unsubscribe(APIConstants.questions, this.componentKey, this.props.courseId);
    API.unsubscribe(APIConstants.responses, this.componentKey, lectureKey);
  }

  initData(courseKey) {
    if (courseKey) {
      let lectureKey = this.props.routeParams.lectureId;
      let lecture = LectureStore.getAll(lectureKey);
      this.setState({lecture: lecture});
      this.setState({questions: QuestionStore.getAll(courseKey)});
      this.setState({responses: PresentationStore.getResponses(lectureKey)});
      API.subscribe(APIConstants.lectures, this.componentKey, courseKey);
      API.subscribe(APIConstants.questions, this.componentKey, courseKey);
      API.subscribe(APIConstants.responses, this.componentKey, lectureKey);
    }
  }

  onLectureChange() {
    let lecture = LectureStore.get(this.props.courseId, this.props.routeParams.lectureId);
    this.setState({'lecture': lecture});
  }

  onQuestionChange() {
    this.setState({'questions': QuestionStore.getAll(this.props.courseId)});
  }

  onPresentationChange() {
    this.setState({'responses': PresentationStore.getResponses(this.props.routeParams.lectureId)});
  }

  onActivateQuestion(key) {
    this.setState({activeQuestionKey: key});
    this.reset();
  }

  onThumbnailClick(key) {
    console.log('make a large version of submission ' + key);
  }

  start() {
    this.setState({takingQuestions: true});
    this.refs.timer.startTimer();
  }

  stop() {
    this.setState({takingQuestions: false});
    this.refs.timer.stopTimer();
  }

  reset() {
    this.setState({takingQuestions: false});
    if (this.refs.timer) {
      this.refs.timer.resetTimer();
    }
  }

  render() {
    this.styles = {
      presenterCode: {
        display: 'flex',
        flexDirection: 'column',
      },
      presenterCodeTitle: {
        fontSize: 22,
        letterSpacing: '8px',
      },
      presenterCodeCode: {
        fontSize: 50,
        lineHeight: 0.8,
      },
      presenterLink: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 50,
      },
      timer: {
        alignSelf: 'flex-end',
        margin: '5px 20px',
      },
    };

    let questions = [];
    let activeQuestion;
    let activeQuestionComponent;
    if (this.state.lecture && this.state.lecture.questions && this.state.questions) {
      questions = this.state.lecture.questions.map((key) => {
        return {
          key: key,
          value: this.state.questions[key],
        };
      });

      // Find the currently active question
      questions.forEach((q) => {
        if (q.key === this.state.activeQuestionKey) {
          activeQuestion = q;
          if (activeQuestion) {
            activeQuestionComponent = <PresenterQuestion question={activeQuestion}/>;
          }
        }
      });
    }

    if (typeof this.state.activeQuestionKey !== 'undefined') {
      var timer = <Timer interval="1000" increment="1000" ref="timer"/>;
      var button;
      if (this.state.takingQuestions) {
        button = <Button key="1" onClick={this.stop}>Stop Taking Responses</Button>;
      } else {
        button = <Button key="2" onClick={this.start}>Start Taking Responses</Button>;
      }
    }

    let activeResponses;
    if (typeof this.state.activeQuestionKey !== 'undefined') {
      activeResponses = this.state.responses[this.state.activeQuestionKey];
    }

    return (
      <div className='PresenterView'>
        <div className='Column--main'>

          <div className="PresentationDetails">
            <div className="Step">
              <div className='Step-number'>1</div>
              <div className='Step-instructions'>
                <span className='Step-label'>Go to</span><span className='Step-value'>uqdraw.co</span>
              </div>
            </div>
            <div className="Step">
              <div className='Step-number'>2</div>
              <div className='Step-instructions'>
                <span className='Step-label'>Enter code</span><span className='Step-value'>3fa</span>
              </div>
            </div>
          </div>
          <div className="PresentationQuestion">
            <h2 className='SectionHeading'>Question</h2>
            {activeQuestionComponent}
            <div className='Timer'>
              {timer}
              {button}
            </div>
          </div>
          <div className="PresentationResponses">
            <h2 className='SectionHeading'>Responses</h2>
            <div className="ResponseThumbnails">
              <PresenterResponses responses={activeResponses || {}} onThumbnailClick={this.onThumbnailClick}/>
            </div>
          </div>
        </div>

        <div className='Column--supporting'>
          <QuestionSelector questions={questions} onActivateQuestion={this.onActivateQuestion.bind(this)} activeQuestionKey={this.state.activeQuestionKey}/>
        </div>
      </div>
    );
  }
}

export default Presenter;
