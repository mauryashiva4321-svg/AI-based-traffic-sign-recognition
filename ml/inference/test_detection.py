from pathlib import Path

import cv2

from ml.inference.pipeline import (
    DetectionPipeline
)

from ml.utils.annotator import (
    draw_detections
)


PROJECT_ROOT = Path(

    __file__

).resolve().parents[2]


INPUT_IMAGE = (

    PROJECT_ROOT

    / "test-road.jpg"

)


OUTPUT_IMAGE = (

    PROJECT_ROOT

    / "test-road-detected.jpg"

)


def main():

    if not INPUT_IMAGE.exists():

        print(

            f"Place an image here: "
            f"{INPUT_IMAGE}"

        )

        return


    image = cv2.imread(

        str(

            INPUT_IMAGE

        )

    )


    if image is None:

        print(

            "Could not load image"

        )

        return


    pipeline = (

        DetectionPipeline()

    )


    result = (

        pipeline.predict(

            image

        )

    )


    print(

        result

    )


    annotated_image = (

        draw_detections(

            image,

            result[
                "detections"
            ]

        )

    )


    cv2.imwrite(

        str(

            OUTPUT_IMAGE

        ),

        annotated_image

    )


    print(

        f"Output saved to: "
        f"{OUTPUT_IMAGE}"

    )


if __name__ == "__main__":

    main()