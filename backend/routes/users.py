from fastapi import APIRouter
from database import users
from bson import ObjectId


router = APIRouter()



# ==========================
# GET ALL USERS (ADMIN)
# ==========================

@router.get("/")
def get_users():

    result=[]

    for user in users.find():

        user["_id"]=str(user["_id"])

        result.append(user)


    return result





# ==========================
# GET USER PROFILE
# ==========================

@router.get("/profile")
def get_profile(email: str):

    user = users.find_one(
        {
            "email":email
        }
    )


    if not user:

        return {
            "message":"User not found"
        }



    return {

        "id":str(user["_id"]),
        "name":user.get("name"),
        "email":user.get("email"),
        "role":user.get("role"),
        "status":user.get("status","Active")

    }






# ==========================
# UPDATE PROFILE
# ==========================


@router.put("/profile")
def update_profile(data:dict):

    email=data.get("email")


    users.update_one(

        {
            "email":email
        },

        {

        "$set":{

            "name":data.get("name"),
            "skills":data.get("skills"),
            "experience":data.get("experience"),
            "location":data.get("location"),
            "github":data.get("github"),
            "portfolio":data.get("portfolio"),
            "about":data.get("about")

        }

        }

    )


    return {

        "message":"Profile updated successfully"

    }







# ==========================
# ADMIN DELETE USER
# ==========================


@router.delete("/{user_id}")
def delete_user(user_id:str):


    result = users.delete_one(
        {
            "_id":ObjectId(user_id)
        }
    )


    if result.deleted_count == 0:

        return {
            "message":"User not found"
        }



    return {

        "message":"User deleted successfully"

    }








# ==========================
# ADMIN CHANGE ROLE
# ==========================


@router.put("/{user_id}/role")
def change_role(
    user_id:str,
    data:dict
):


    role=data.get("role")



    users.update_one(

        {
            "_id":ObjectId(user_id)
        },

        {

        "$set":{

            "role":role

        }

        }

    )



    return {

        "message":"Role updated"

    }








# ==========================
# ADMIN USER STATUS
# ==========================


@router.put("/{user_id}/status")
def change_status(
    user_id:str,
    data:dict
):


    status=data.get("status")



    users.update_one(

        {
            "_id":ObjectId(user_id)
        },

        {

        "$set":{

            "status":status

        }

        }

    )


    return {

        "message":"Status updated"

    }