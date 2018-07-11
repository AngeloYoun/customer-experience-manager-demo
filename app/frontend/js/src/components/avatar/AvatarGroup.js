import Avatar from 'components/avatar/Avatar';

function AvatarGroup({people}) {
	const content = [];

	if (people) {
		people.forEach(
			(person, index) => {
				const avatarUrl = person.get('avatar');

				content.push(
					<Avatar
						href={avatarUrl}
						key={index}
					/>
				);
			}
		);
	}

	return (
		<div class="avatar-group-container">
			{content}
		</div>
	);
}

export default AvatarGroup;