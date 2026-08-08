import cv2


def draw_detections(

    image,

    detections

):

    output = image.copy()


    for detection in detections:

        bbox = (

            detection["bbox"]

        )


        x1 = bbox["x1"]

        y1 = bbox["y1"]

        x2 = bbox["x2"]

        y2 = bbox["y2"]


        sign_name = (

            detection["class_name"]

        )


        confidence = (

            detection[
                "classification_confidence"
            ]

        )


        label = (

            f"{sign_name} "
            f"{confidence * 100:.1f}%"

        )


        cv2.rectangle(

            output,

            (

                x1,

                y1

            ),

            (

                x2,

                y2

            ),

            (

                0,

                255,

                0

            ),

            2

        )


        text_y = (

            y1 - 10

        )


        if text_y < 20:

            text_y = y1 + 25


        cv2.putText(

            output,

            label,

            (

                x1,

                text_y

            ),

            cv2.FONT_HERSHEY_SIMPLEX,

            0.6,

            (

                0,

                255,

                0

            ),

            2,

            cv2.LINE_AA

        )


    return output