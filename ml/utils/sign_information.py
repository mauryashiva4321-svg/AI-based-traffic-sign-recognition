SIGN_INFORMATION = {

    "Stop": {

        "description":
        "Indicates that the driver must stop completely.",

        "recommended_action":
        "Stop the vehicle completely and proceed only when safe."

    },

    "Yield": {

        "description":
        "Indicates that the driver must give way to other road users.",

        "recommended_action":
        "Slow down and give priority to vehicles and pedestrians."

    },

    "No entry": {

        "description":
        "Vehicles are not permitted to enter this road.",

        "recommended_action":
        "Do not enter this road."

    },

    "Road work": {

        "description":
        "Indicates construction or maintenance work ahead.",

        "recommended_action":
        "Slow down and drive carefully."

    },

    "Traffic signals": {

        "description":
        "Traffic signals are present ahead.",

        "recommended_action":
        "Observe the traffic light and follow its signal."

    },

    "Pedestrians": {

        "description":
        "Pedestrians may be present on or near the road.",

        "recommended_action":
        "Slow down and watch carefully for pedestrians."

    },

    "Children crossing": {

        "description":
        "Children may cross the road ahead.",

        "recommended_action":
        "Reduce speed and drive carefully."

    },

    "Roundabout mandatory": {

        "description":
        "A roundabout is ahead.",

        "recommended_action":
        "Follow the correct direction around the roundabout."

    }

}


def get_sign_information(
    sign_name: str
) -> dict:

    return SIGN_INFORMATION.get(

        sign_name,

        {

            "description":
            "Traffic sign detected.",

            "recommended_action":
            "Follow the traffic sign and drive safely."

        }

    )