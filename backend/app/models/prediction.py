from datetime import datetime, timezone


def create_prediction_document(

    user_id: str,

    source_type: str,

    filename: str,

    total_detections: int,

    detections: list

):

    return {

        "user_id":

        user_id,


        "source_type":

        source_type,


        "filename":

        filename,


        "total_detections":

        total_detections,


        "detections":

        detections,


        "created_at":

        datetime.now(

            timezone.utc

        )

    }


def serialize_prediction(

    prediction: dict

):

    return {

        "id":

        str(

            prediction["_id"]

        ),


        "user_id":

        prediction[

            "user_id"

        ],


        "source_type":

        prediction[

            "source_type"

        ],


        "filename":

        prediction[

            "filename"

        ],


        "total_detections":

        prediction[

            "total_detections"

        ],


        "detections":

        prediction[

            "detections"

        ],


        "created_at":

        prediction[

            "created_at"

        ].isoformat()

    }