import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Hobbies = new Mongo.Collection('hobbies');

if (Meteor.isServer) {
	//This code only runs on server
	//Only publish person that are public or belong to the current user
	Meteor.publish('hobbies', function hobbiesPublication() {
		return Hobbies.find({
			$or: [
				{ private: { $ne: true } },
				{ owner: this.userId },
			],
		});
	});
}
Meteor.methods({
	'hobbies.insert'(personId, text) { 
        check(text, String);
        check(personId, String);
	//Make sure the user is logged in before inserting the hobbies
	if (! Meteor.userId()) {
		throw new Meteor.Error('not-autorized');
	}
		Hobbies.insert({
        personId, //:this._id,
		text,
		createdAt: new Date(),
		owner: Meteor.userId(),
		username: Meteor.user().username,
		});
    },
    'hobbies.remove'(hobbyId) {
		check(hobbyId, String); //Mongo.ObjectID);
		
		Hobbies.remove(hobbyId);
	},
})