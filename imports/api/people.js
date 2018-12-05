import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

 
export const People = new Mongo.Collection('people');

if (Meteor.isServer) {
	//This code only runs on server
	//Only publish person that are public or belong to the current user
	Meteor.publish('people', function peoplePublication() {
		return People.find({
			$or: [
				{ private: { $ne: true } },
				{ owner: this.userId },
			],
		});
	});
}

Meteor.methods({
	'people.insert'(text) { 
		check(text, String);
	//Make sure the user is logged in before inserting the people
	if (! Meteor.userId()) {
		throw new Meteor.Error('not-autorized');
	}
		People.insert({
		text,
		createdAt: new Date(),
		owner: Meteor.userId(),
		username: Meteor.user().username,
		});
	},
	'people.remove'(personId) {
		check(personId, String); //Mongo.ObjectID);
		
		People.remove(personId);
	},
	// 'people.setChecked'(personId, setChecked) {
	// 	check(personId, String); //Mongo.ObjectID);
	// 	check(setChecked, Boolean);
		
	// 	People.update(personId, { $set: { checked: setChecked } });
	// },
	'people.setPrivate'(personId, setToPrivate) {
		check(personId, String); //Mongo.ObjectID);
		check(setToPrivate, Boolean);

		const person = People.findOne(personId);

		// Make sure only the person owner can make a person private 
		if (person.owner !== Meteor.userId()) {
			throw new Meteor.Error('not-autorized');
		}

		People.update(personId, { $set: { private: setToPrivate } });
	},
});