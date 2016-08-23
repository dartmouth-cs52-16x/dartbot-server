import Bio from '../models/bio_model';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config({ silent: true });

const s3Bucket = process.env.S3_BUCKET_NAME;
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const createBio = (req, res) => {
  const bio = new Bio();
  bio.name = req.body.name;
  bio.major = req.body.major;
  bio.year = req.body.year;
  bio.content = req.body.content;
  bio.save()
  .then(result => {
    res.json(result);
    // bio.image = `https://${s3Bucket}.s3.amazonaws.com/${result._id}`;
    // bio.save().then((resultWithImage) => {
    //   res.json(bio);
    // })
    // . catch(error => {
    //   res.json({ error });
    // });
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getBios = (req, res) => {
  Bio.find()
  .then(bios => {
    res.json(bios);
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getBio = (req, res) => {
  Bio.findById(req.params.id)
  .then(bio => {
    res.json(bio);
  })
  .catch(error => {
    res.json({ error });
  });
};

export const updateBio = (req, res) => {
  const id = req.params.id;
  Bio.findById(id)
  .then(bio => {
    bio.name = req.body.name;
    bio.content = req.body.content;
    bio.major = req.body.major;
    bio.year = req.body.year;
    console.log(bio);
    bio.save()
    .then((result) => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });
    res.json(bio);
  })
  .catch(error => {
    res.json({ error });
  });
};

export const deleteBio = (req, res) => {
  Bio.findByIdAndRemove(req.params.id)
  .then(result => {
    Bio.find()
    .then(bios => {
      res.json(bios);
    })
    .catch(error => {
      res.json({ error });
    });
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getSignedRequest = (req, res) => {
  console.log(req.body.id);
  const s3Params = {
    Bucket: s3Bucket,
    Key: req.body.id,
    Expires: 60, // expire after 60 mins
    ContentType: req.body.filetype,
    ACL: 'public-read',
  };
  const s3bucket = new AWS.S3();

  // get signed URL
  s3bucket.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const returnData = {
        requestUrl: data,
        imageUrl: `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.id}`,
      };
      Bio.findById(req.body.id)
      .then(bio => {
        bio.image = `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.id}`;
        bio.save().then((resultWithImage) => {
          res.json(returnData);
        })
        . catch(error => {
          res.json({ error });
        });
      });
    }
  });
};
