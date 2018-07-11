import {List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import {NAME as CONTACTS} from 'actions/contacts';
import fieldMap, {fieldValue} from 'lib/field-formats';

const {
	[CONTACTS]: contactsFields
} = fieldMap;

class ContactsList extends JSXComponent {
	render() {
		const {
			contacts
		} = this.props;

		return (
			<div class="contacts-list-container">
				{contacts.map(
					contact => (
						<div class="contact-entry">
							<div class="entry-title">
								<h4 class="contact-name">
									{contact.get(contactsFields.NAME)}
								</h4>

								<h4 class="contact-role">
									{contact.get(contactsFields.TITLE)}
								</h4>
							</div>

							<div class="meta">
								<h4 class="purchase-involvement">
									{contact.get(contactsFields.PURCHASE_DECISION_INVOLVEMENT)}
								</h4>

								<h4 class="email">
									<a
										class="link"
										href={`mailto:${contact.get(contactsFields.EMAIL)}`}
									>
										{contact.get(contactsFields.EMAIL)}
									</a>
								</h4>
							</div>
						</div>
					)
				).toJS()}
			</div>
		);
	}
}

ContactsList.PROPS = {
	contacts: Config.instanceOf(List).required()
};

export default ContactsList;
