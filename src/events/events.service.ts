import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from 'src/users/schemas/student.schema';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { Activity } from 'src/subject-content/schemas/activity.schema';

@Injectable()
export class EventsService {
  constructor(
    //@InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
  ) {}

  async createEvent(eventData) {
    if (eventData.type == 'Assignment') {
      const activityData = await this.activityModel
        .findById(eventData?.activityId)
        .lean()
        .exec();

      eventData = {
        ...eventData,
        activity: activityData,
        title: `Assignment Due : ${activityData?.title}`,
        desc: `Your Grade ${activityData?.grade} - ${activityData?.subject} - Assignment will be due soon`,
        start: new Date(eventData?.assignedTime).setHours(
          new Date(eventData?.assignedTime).getHours() + 23,
        ),
        end: new Date(eventData?.assignedTime).setHours(
          new Date(eventData?.assignedTime).getHours() + 24,
        ),
      };
    }

    const response = await this.eventModel.create(eventData);

    if (!response) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        messsage: `Unable to create event for user`,
      };
    }

    return {
      status: HttpStatus.CREATED,
      message: `New Event created for user ${eventData?.studentId}`,
      createdEvent: eventData,
    };
  }

  async getAllEventsByStudentId(studentId) {
    const allEvents = await this.eventModel.find({
      studentId: studentId,
    });

    if (!allEvents) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        messsage: `Unable to fetch all events for Student ${studentId}`,
      };
    }

    return {
      status: HttpStatus.OK,
      allEvents: allEvents,
    };
  }
}
