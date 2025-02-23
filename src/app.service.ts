import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Activity } from './subject-content/schemas/activity.schema';
import { Model } from 'mongoose';
import { VideoLesson } from './subject-content/schemas/video-lesson.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
    @InjectModel(VideoLesson.name) private videoLessonModel: Model<VideoLesson>,
    // private _utilService: UtilService,
  ) {}

  // add initial data to Activity collection
  async addInitialActivityData() {
    const arr = [
      {
        title:
          '01_පූර්ව භාෂා කුසලතා - ක්‍රියාකාරකම් පත්‍රිකාව - සමාන රූප යා කරමු',
        file_link:
          'https://drive.google.com/file/d/1RGWAsSCtLWBUGdmAzKypYmr42-N9YKCh/view?usp=drive_link',
        grade: '1',
        subject: 'sinhala',
        term: '1',
        type: 'matching',
      },
    ];

    await this.activityModel
      .insertMany(arr)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Add initial data to VideoLesson collection
  async addInitialVideoLessonData() {
    const arr = [
      {
        title:
          '01_පූර්ව භාෂා කුසලතා - ක්‍රියාකාරකම් පත්‍රිකාව - සමාන රූප යා කරමු',
        video_link:
          'https://drive.google.com/file/d/1RGWAsSCtLWBUGdmAzKypYmr42-N9YKCh/view?usp=drive_link',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title:
          '01_ශබ්දවලට සවන්දීමෙන් ඒ වගේ සියුම් වෙනස්කම් හඳුනාගෙන වෙනස්කම් දක්වයි',
        video_link: 'https://www.youtube.com/watch?v=mvjeiDnGXxs',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '02_රූප දෙස බලා එහි සුවිශේෂතා හඳුනාගෙන ලකුණු කරයි',
        video_link: 'https://www.youtube.com/watch?v=NzG3Bwkc8GQ',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '03_රූපමත කොළ අලවා නිර්මාණයක් කරමු',
        video_link: 'https://www.youtube.com/watch?v=8CvCo_NYOTA',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '04_රැළි කපා ඇලවීම සහ වෙස් මුහුණු නිර්මාණය කිරීම',
        video_link: 'https://www.youtube.com/watch?v=2wt_b8XyrbI',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '05_කඩදාසි වලින් රූප නිර්මාණය කිරීම',
        video_link: 'https://www.youtube.com/watch?v=Fq9YF6GA9SU',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '06_මල් වත්තක් නිර්මාණය කරමු',
        video_link: 'https://www.youtube.com/watch?v=txS93WCQ7qs',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '07_විශාල වස්තූන් හා කුඩා වස්තූන් හදුනා ගැනීම',
        video_link: 'https://www.youtube.com/watch?v=M8D_WuxB4LU',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '08_පින්තූර බලා වචන කියවමු Part 01',
        video_link: 'https://www.youtube.com/watch?v=JZnv9BUkQ0I',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '09_පින්තූර බලා වචන කියවමු Part 02',
        video_link: 'https://www.youtube.com/watch?v=H-0LjO1TFfI',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '10_හැඩ අඳිමු Part 01',
        video_link: 'https://www.youtube.com/watch?v=C7mBIXSEazM',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '11_හැඩ අඳිමු Part 02',
        video_link: 'https://www.youtube.com/watch?v=kdMa99jSR6s',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '12_හැඩ අඳිමු Part 03',
        video_link: 'https://www.youtube.com/watch?v=_YzrJS4O8DE',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '13_හැඩ අඳිමු Part 04',
        video_link: 'https://www.youtube.com/watch?v=34QXMnetxFc',
        grade: '1',
        subject: 'sinhala',
      },
      {
        title: '14_හැඩ අඳිමු Part 05',
        video_link: 'https://www.youtube.com/watch?v=zOljJy7p29w',
        grade: '1',
        subject: 'sinhala',
      },
    ];

    await this.videoLessonModel
      .insertMany(arr)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
