const fs = require('fs');
const path = require('path');
const { ClientError } = require('../utils/error');

const GET = (req, res, next) => {
	try {
		const { videoId } = req.params;
		const {
			page = req.PAGINATION.page,
			limit = req.PAGINATION.limit,
			search,
			userId,
		} = req.query;

		let videos = req.select('videos');

		if (videoId) {
			return res.json(videos.find((item) => item.videoId == videoId));
		}

		videos = videos.slice(page * limit - limit, page * limit);
		videos = videos.filter((video) => {
			let userFilter = userId ? video.userId == userId : true;
			let searchFilter = search
				? video.videoTitle
						.toLowerCase()
						.includes(search.toLowerCase().trim())
				: true;
			return userFilter && searchFilter;
		});

		return res.json(videos);
	} catch (error) {
		return next(error);
	}
};

const POST = (req, res, next) => {
	try {
		let { videoTitle } = req.body;
		videoTitle = videoTitle.trim();
		if (videoTitle.length < 1) {
			throw new ClientError(400, 'Videotitle is required');
		}

		if (videoTitle.length > 30) {
			throw new ClientError(413, 'Videotitle is too long');
		}

		if (!req.file) {
			throw new ClientError(400, 'Video argument is required');
		}

		const { mimetype, size, buffer, originalname } = req.file;

		if (size > 209715200) {
			throw new ClientError(413, 'File must not be larger than 200MB!');
		}

		if (mimetype !== 'video/mp4') {
			throw new ClientError(415, 'File must be MP4');
		}

		const fileName = originalname.replace(/\s/g, '');
		const filePath = path.join(
			process.cwd(),
			'files',
			'videos',
			'videos' + fileName,
		);
		fs.writeFileSync(filePath, buffer);

		const videos = req.select('videos');
		const new_video = {
			videoId: videos.length ? videos[videos.length - 1].videoId + 1 : 1,
			userId: req.userId,
			videoTitle: videoTitle,
			videoUrl: '/videos/' + fileName,
			videoSize: (size / 1024 / 1024).toFixed(1),
			videoCreatedAt: Date(),
		};

		videos.push(new_video);
		req.insert('videos', videos);
		return res.status(201).json({
			video: new_video,
			message: 'The video has been added',
		});
	} catch (error) {
		return next(error);
	}
};

const PUT = (req, res, next) => {
	try {
		const { videoId, videoTitle } = req.body;

		if (!videoId) {
			throw new Error('VideoID is required');
		}

		if (videoTitle.length < 1) {
			throw new Error('Video Title is required');
		}

		if (videoTitle.length > 30) {
			throw new Error('Video Title is too long');
		}

		const videos = req.select('videos');
		const found = videos.find(
			(video) => video.videoId == videoId && video.userId == req.userId,
		);

		if (!found) {
			throw new Error('There is no such video');
		}

		found.videoTitle = videoTitle;
		req.insert('videos', videos);
		return res
			.status(201)
			.json({ video: found, message: 'The video updated!' });
	} catch (error) {
		return next(error);
	}
};

const DELETE = (req, res, next) => {
	try {
		const { videoId } = req.body;

		if (!videoId) {
			throw new Error('VideoID is required');
		}

		let videos = req.select('videos');
		let found = videos.findIndex(
			(video) => video.videoId == videoId && video.userId == req.userId,
		);

		if (found == -1) {
			throw new Error('There is no such video');
		}

		const [deleteVideo] = videos.splice(found, 1);
		fs.unlinkSync(path.join(process.cwd(), 'files', deleteVideo.videoUrl));
		req.insert('videos', videos);
		return res
			.status(201)
			.json({ video: deleteVideo, message: 'The video Deleted!' });
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	GET,
	POST,
	PUT,
	DELETE,
};
