from ml.inference.detector import (
    TrafficSignDetector
)

from ml.inference.classifier import (
    TrafficSignClassifier
)

from ml.utils.image_utils import (
    crop_image
)

from ml.utils.sign_information import (
    get_sign_information
)


class DetectionPipeline:

    def __init__(self):

        self.detector = (

            TrafficSignDetector()

        )


        self.classifier = (

            TrafficSignClassifier()

        )


    def predict(

        self,

        image

    ) -> dict:

        detections = (

            self.detector.detect(

                image

            )

        )


        results = []


        for detection in detections:

            try:

                cropped_sign = (

                    crop_image(

                        image,

                        detection["bbox"]

                    )

                )


                classification = (

                    self.classifier.predict(

                        cropped_sign

                    )

                )


                information = (

                    get_sign_information(

                        classification[
                            "class_name"
                        ]

                    )

                )


                results.append({

                    "bbox":

                    detection["bbox"],


                    "detector_confidence":

                    detection[
                        "detector_confidence"
                    ],


                    "class_id":

                    classification[
                        "class_id"
                    ],


                    "class_name":

                    classification[
                        "class_name"
                    ],


                    "classification_confidence":

                    classification[
                        "confidence"
                    ],


                    "description":

                    information[
                        "description"
                    ],


                    "recommended_action":

                    information[
                        "recommended_action"
                    ]

                })


            except Exception as error:

                print(

                    f"Detection processing error: "
                    f"{error}"

                )


        return {

            "total_detections":

            len(

                results

            ),


            "detections":

            results

        }