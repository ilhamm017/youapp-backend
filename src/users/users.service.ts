import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { calculateHoroscope } from './utils/horoscope.calculator';
import { calculateChineseZodiac } from './utils/zodiac.calculator';
import { InterestLinkedList } from '../shared/data-structures/linked-list';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    /**
     * Create or update user profile
     * Demonstrates use of LinkedList for managing interests
     */
    async createProfile(userId: string, createProfileDto: CreateProfileDto): Promise<UserDocument> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Process interests using custom LinkedList data structure
        let processedInterests: string[] = [];
        if (createProfileDto.interests && createProfileDto.interests.length > 0) {
            const interestList = InterestLinkedList.fromArray(createProfileDto.interests);
            processedInterests = interestList.toArray();
        }

        // Calculate horoscope and zodiac if birthday is provided
        let horoscope: string | undefined;
        let zodiac: string | undefined;

        if (createProfileDto.birthday) {
            horoscope = calculateHoroscope(new Date(createProfileDto.birthday));
            zodiac = calculateChineseZodiac(new Date(createProfileDto.birthday));
        }

        // Update profile
        user.profile = {
            ...user.profile,
            ...createProfileDto,
            interests: processedInterests,
            horoscope: horoscope || user.profile?.horoscope,
            zodiac: zodiac || user.profile?.zodiac,
        };

        await user.save();

        return user;
    }

    /**
     * Get user profile by user ID or username
     */
    async getProfile(identifier: string): Promise<UserDocument> {
        let user: UserDocument | null;

        // Check if identifier is a MongoDB ObjectId
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            user = await this.userModel.findById(identifier);
        } else {
            // Otherwise, search by username
            user = await this.userModel.findOne({ username: identifier });
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    /**
     * Update user profile
     * Recalculates horoscope/zodiac if birthday changes
     */
    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Process interests using LinkedList if provided
        let processedInterests: string[] | undefined;
        if (updateProfileDto.interests) {
            const interestList = InterestLinkedList.fromArray(updateProfileDto.interests);
            processedInterests = interestList.toArray();
        }

        // Recalculate horoscope and zodiac if birthday is updated
        let horoscope = user.profile?.horoscope;
        let zodiac = user.profile?.zodiac;

        if (updateProfileDto.birthday) {
            horoscope = calculateHoroscope(new Date(updateProfileDto.birthday));
            zodiac = calculateChineseZodiac(new Date(updateProfileDto.birthday));
        }

        // Update profile fields
        user.profile = {
            ...user.profile,
            ...updateProfileDto,
            interests: processedInterests || user.profile?.interests,
            horoscope,
            zodiac,
        };

        await user.save();

        return user;
    }

    /**
     * Find user by ID (helper method)
     */
    async findById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId);
    }

    /**
     * Add interest to user profile using LinkedList
     */
    async addInterest(userId: string, interest: string): Promise<UserDocument> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Use LinkedList to manage interests
        const interests = user.profile?.interests || [];
        const interestList = InterestLinkedList.fromArray(interests);

        // Add new interest if not already present
        if (!interestList.find(interest)) {
            interestList.insert(interest);
            user.profile = {
                ...user.profile,
                interests: interestList.toArray(),
            };
            await user.save();
        }

        return user;
    }

    /**
     * Remove interest from user profile using LinkedList
     */
    async removeInterest(userId: string, interest: string): Promise<UserDocument> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Use LinkedList to manage interests
        const interests = user.profile?.interests || [];
        const interestList = InterestLinkedList.fromArray(interests);

        // Remove interest
        interestList.remove(interest);
        user.profile = {
            ...user.profile,
            interests: interestList.toArray(),
        };

        await user.save();

        return user;
    }
}
