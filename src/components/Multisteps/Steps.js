import React from 'react';
import './style.css';

export default class Steps extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentStep: props.currentStep
    };

    this._moveStep = this._moveStep.bind(this);
    this._printNav = this._printNav.bind(this);

    this.props.onStepChange(this.state.currentStep);
  }

  render() {
    let { currentStep } = this.state;
    let { children } = this.props;

    return (
      <div className="steps-component">
        <div className="steps-navigator avUlHeader">
		  <div className="avUlHeader">
          {
            this._printStepsLabel(children, currentStep)
          }
		  </div>
		  <div className="avClear"></div>
		  <div>
          {
            this._printStepsTitle(children, currentStep)
          }
		  </div>
        </div>
        <div className="steps-content">
          {
            this._printSteps(children, currentStep)
          }
        </div>
          {
            this._printNav(currentStep, children.length)
          }
      </div>
    );
  }
  
  _printStepsTitle(children, currentStep){
    return (
      React.Children.map(children, (child, index) => {
        let isActive = index + 1 === currentStep ? 'avHide avTitle' : 'avShow avTitle';
        return (
			<h4 className={isActive} >{child.props.value}</h4>
        )
      })
    )
  }

  _printStepsLabel(children, currentStep) {
    return (
      React.Children.map(children, (child, index) => {
        let isActive = index + 1 === currentStep ? 'avCircle ghostwhite' : 'avCircle lightgrey';
        let { customNavigator } = child.props;
        return (
		    <div className={isActive} key={index} onClick={() => {this._moveStep(index + 1)}}>{index + 1}</div>

        )
      })
    )
  }
  
  /*
			<svg key={index} className="multiStepSvg" width="100" height="100" onClick={() => {this._moveStep(index + 1)}}>			
				<g fill={isActive}>
					<circle cx="40" cy="40" r="40"></circle>
					<text x="28" y="54">{index + 1}</text>
				</g>
			</svg>	

			
          <li key={index} className={isActive} onClick={() => {this._moveStep(index + 1)}}>
            {customNavigator ? customNavigator : index + 1}
          </li>
  */

  _printSteps(children, currentStep) {
    return (
      React.Children.map(children, (child, index) => {
        let stepNumber = index + 1;
        let isSibling = currentStep + 1 === stepNumber || currentStep - 1 === stepNumber;
        let settings = {
          key: index,
          index,
          stepNumber: stepNumber,
          isActive: currentStep === stepNumber,
          isSibling: this.props.mountOnlySiblings ? isSibling : true
        };
        return (
          // child.type === <Step/>
          <child.type {...settings}>
            {child.props.children}
          </child.type>
        );
      })
    )
  }

  _printNav(currentStep, childrenLength) {
    return (
	  //disabled={currentStep === childrenLength || !this.props.disabledNextButton}
      <div className="steps-nav avInnerDiv">
        <button
          className="btn btn-rectangle btn-wd"
          onClick={() => {this._moveStep(currentStep - 1)}}
          disabled={currentStep === 1}
        >
          {this.props.prevButton}
        </button>
        <button
          className="btn btn-rectangle btn-wd"
          onClick={() => {this._moveStep(currentStep + 1)}}
          disabled={currentStep === childrenLength || !this.props.disabledNextButton}
        >
          {this.props.nextButton}
        </button>
      </div>
    )
  }
 
  _moveStep(step) {
    if (this.props.stepShouldChange()) {
      this.setState({
        currentStep: step
      });
      this.props.onStepChange(step);
    }
  }
}

Steps.propTypes = {
  currentStep: React.PropTypes.number,
  stepShouldChange: React.PropTypes.func,
  onStepChange: React.PropTypes.func,
  mountOnlySiblings: React.PropTypes.bool
};

Steps.defaultProps = {
  currentStep: 1,
  stepShouldChange: () => {return true;},
  onStepChange: () => {},
  prevButton: 'Prev',
  nextButton: 'Next',
  mountOnlySiblings: false
};
