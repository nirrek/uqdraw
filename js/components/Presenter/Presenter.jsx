import React, { Component } from 'react';
import Button from '../Button/Button.jsx';
import Timer from '../Timer/Timer.jsx';
import LectureStore from '../../stores/LectureStore.js';
import PresentationStore from '../../stores/PresentationStore.js';
import generateComponentKey from '../../utils/ComponentKey.js';
import { subscribe, unsubscribe, APIConstants } from '../../utils/API.js';
import QuestionSelector from './PresenterQuestionSelector.jsx';
import PresenterQuestion from './PresenterQuestion.jsx';
import PresenterResponses from './PresenterResponses.jsx';
import './Presenter.scss';

export default class Presenter extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    props.onChangeCourse(null, props.params.courseName);
    this.componentKey = generateComponentKey();
    this.state = {
      activeQuestionKey: '',
      responses: [],
      courseId: undefined,
      lecture: {},
      isTakingResponses: false,
      timeElapsed: 0,
    };

    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
    this.onPresentationChange = this.onPresentationChange.bind(this);
  }

  componentDidMount() {
    LectureStore.addChangeListener(this.onLectureChange);
    PresentationStore.addChangeListener(this.onPresentationChange);
    this.initData(this.props.courseId);
  }

  componentWillReceiveProps(newProps) {
    this.initData(newProps.courseId);
  }

  componentWillUnmount() {
    const lectureKey = this.props.params.lectureId;
    LectureStore.removeChangeListener(this.onLectureChange);
    PresentationStore.removeChangeListener(this.onPresentationChange);
    unsubscribe(APIConstants.lectures, this.componentKey, this.props.courseId);
    unsubscribe(APIConstants.responses, this.componentKey, lectureKey);
  }

  initData(courseKey) {
    if (!courseKey) return;

    const lectureKey = this.props.params.lectureId;
    const lecture = LectureStore.getAll(lectureKey);
    this.setState({
      lecture,
      responses: PresentationStore.getResponses(lectureKey)
    });
    subscribe(APIConstants.lectures, this.componentKey, courseKey);
    subscribe(APIConstants.responses, this.componentKey, lectureKey);
  }

  onLectureChange() {
    const { courseId, params } = this.props;
    const lecture = LectureStore.get(courseId, params.lectureId);
    this.setState({ lecture });
  }

  onPresentationChange() {
    const { params } = this.props;
    this.setState({
      'responses': PresentationStore.getResponses(params.lectureId)
    });
  }

  onActivateQuestion(key) {
    this.setState({
      activeQuestionKey: key,
      timeElapsed: 0,
    });
  }

  onThumbnailClick(key) {
    // TODO
    console.log('make a large version of submission ' + key);
  }

  render() {
    const { lecture, activeQuestionKey, responses } = this.state;

    let questions = [];
    let activeQuestion;
    if (lecture && lecture.questions && lecture.questionOrder) {
      questions = lecture.questionOrder.map(key => ({
        key,
        value: lecture.questions[key],
      }));
      activeQuestion = questions.find(q => q.key === activeQuestionKey);
    }

    const activeResponses = activeQuestionKey ?
      // responses[activeQuestionKey]: // TODO restore once data model updated
      responses['-JmhCbo1eHVVsTEA4TuZ']:
      {};

    console.log(this.state);

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
            {activeQuestion ? (
              <PresenterQuestion question={activeQuestion} />
            ) : (
              <h3 className='PresentationQuestion-hint'>
                Select a question on the right when you are ready to begin.
              </h3>
            )}
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
