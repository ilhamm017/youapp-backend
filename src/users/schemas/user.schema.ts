import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, index: true })
    username: string;

    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop({ required: true, select: false })
    password?: string;

    @Prop({ type: Object })
    profile: {
        name?: string;
        birthday?: Date;
        horoscope?: string;
        zodiac?: string;
        gender?: string;
        height?: number; // in cm
        weight?: number; // in kg
        interests?: string[];
        about?: string;
        profilePicture?: string;
    };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes for better query performance
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual fields for horoscope and zodiac (computed from birthday)
UserSchema.virtual('computedHoroscope').get(function () {
    return this.profile?.horoscope;
});

UserSchema.virtual('computedZodiac').get(function () {
    return this.profile?.zodiac;
});

// Ensure virtuals are included when converting to JSON
UserSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    },
});
