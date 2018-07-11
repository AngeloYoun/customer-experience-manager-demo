import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

class ActivityDateLine extends JSXComponent {
	render() {
		const {
			activityDate
		} = this.props;

		const formatedDate = Moment(activityDate).format('MMMM Do YYYY');

		return (
			<div class="activity-date-line-container">
				<h3 class="date">{formatedDate}</h3>
			</div>
		);
	}
}

ActivityDateLine.PROPS = {
	activityDate: Config.number().required()
};

export default ActivityDateLine;