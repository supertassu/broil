import PropTypes from 'prop-types';
import Spinner from 'ink-spinner';
import {h, Component, Text} from 'ink';

/**
 * Possible loadingState values: waiting, loading, success, failed
 */
export class State extends Component {
	render() {
		if (this.props.loadingState === 'waiting') {
			return (
				<div>
					<Text white>❯</Text> {this.props.text} {this.props.info === null ? '' : this.props.info}
				</div>
			);
		}

		if (this.props.loadingState === 'loading') {
			return (
				<div>
					<Spinner yellow/> {this.props.text} {this.props.info === null ? '' : this.props.info}
				</div>
			);
		}

		if (this.props.loadingState === 'success') {
			return (
				<div>
					<Text green>✔</Text> {this.props.text} {this.props.info === null ? '' : this.props.info}
				</div>
			);
		}

		return (
			<div>
				<Text red>✖</Text> {this.props.text} {this.props.info === null ? '' : this.props.info}<br/>
				<Text gray>&nbsp;{this.props.error}</Text>
			</div>
		);
	}
}

State.propTypes = {
	loadingState: PropTypes.string,
	text: PropTypes.string.isRequired,
	error: PropTypes.string,
	info: PropTypes.string
};

State.defaultProps = {
	loadingState: 'waiting',
	error: null,
	info: null
};

export class Timer extends Component {
	constructor() {
		super();

		this.state = {
			i: 0
		};
	}

	render() {
		return (
			<span>{this.state.i}</span>
		);
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			if (this.props.running) {
				this.setState(prevState => ({
					i: prevState.i + 1
				}));
			}
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}
}

Timer.propTypes = {
	running: PropTypes.bool
};

Timer.defaultProps = {
	running: true
};
