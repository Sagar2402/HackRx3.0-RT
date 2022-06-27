# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

import json
from pathlib import Path
from typing import Any, Text, Dict, List, Optional
from rasa_sdk.events import AllSlotsReset
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher, Action
from rasa_sdk.knowledge_base.storage import InMemoryKnowledgeBase
from rasa_sdk.knowledge_base.actions import ActionQueryKnowledgeBase
from rasa_sdk import Tracker
from rasa_sdk.forms import FormValidationAction
from rasa_sdk.events import AllSlotsReset, SlotSet
from rasa_sdk.events import SlotSet, EventType
from rasa_sdk.types import DomainDict

import requests
import pandas as pd
# visit https://github.com/seatgeek/fuzzywuzzy for more details
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
user_data = {}

userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmI3YzBlMWM1MDY1ZjRkNGRhYTUwYjkiLCJpYXQiOjE2NTYyMTg1ODksImV4cCI6MTY1NjIyMDM4OSwidHlwZSI6ImFjY2VzcyJ9.8ibaPpkIrcmXKyxtpZW9VDJ4SYnRoJ-lURM1Kuu30K0"


class HealthInsurance(Action):
    # print("health")
    def __init__(self):
        self.faq_data = pd.read_csv(
            '/home/akash/backend/hackrx/rasa_f/health_insurance.csv')

    def name(self):
        return 'actions.HealthInsurance'

    def run(self, dispatcher, tracker, domain):

        query = tracker.latest_message['text']

        questions = self.faq_data['question'].values.tolist()

        # use process.extract(.. limits = 3) to get multiple close matches
        mathed_question, score = process.extractOne(
            query, questions, scorer=fuzz.token_set_ratio)
        response = ""
        if score > 50:  # arbitrarily chosen 50 to exclude matches not relevant to the query
            matched_row = self.faq_data.loc[self.faq_data['question']
                                            == mathed_question, ]
            match = matched_row['question'].values[0]
            answer = matched_row['answers'].values[0]
            row = matched_row['row'].values[0]
            response = answer
        else:
            response = "Sorry I couldn't find anything relevant to your query!"
            dispatcher.utter_message(response)

        if row >= 1 and row <= 3:  # buy
            response1 = requests.get(
                f"http://206.189.137.135:3000/insurance?type=Health")
            if response1.status_code == 200:
                print("sucessfully fetched the data")
                dispatcher.utter_message(buttons=[
                    {"payload": "insurance adult", "title": response1.json()[
                        'data'][0]['description']},
                    {"payload": "insurance adult", "title": response1.json()[
                        'data'][1]['description']},
                ])
            else:
                response1 = "Hello person, there's a {response1.status_code} error with your request"
                dispatcher.utter_message(response1)
        else:  # claim

            bearer = 'Bearer '+str(userToken)
            headers = {'Authorization': bearer}
            response = requests.get(
                'http://206.189.137.135:3000/insurance/user', headers=headers)

            # url = 'http://206.189.137.135:3000/insurance/get'
            # payload = {'some': 'data'}
            # headers = {"Authorization": "Bearer MYREALLYLONGTOKENIGOT"}
            # r = requests.post(url, data=json.dumps(payload), headers=headers)response1 = requests.get(f"http://206.189.137.135:3000/insurance/get")

            if response1.status_code == 200:
                print("sucessfully fetched the data")
                response2 = (response1.json()['title'])
                # buttons = []
                # #append the response of API in the form of title and payload
                # buttons.append({'title': response1.json()['title'] , 'payload': "/qn"})
                # buttons.append({'title': response1.json()['completed'] , 'payload': "/qnapi"})
                # #then display it using dispatcher
                dispatcher.utter_message(buttons=[
                    {"payload": "/hl1", "title": response.json()['data']},
                    {"payload": "/hl2", "title": response.json()['data']},
                ])
            else:
                response1 = "Hello person, there's a {response1.status_code} error with your request"
                dispatcher.utter_message(response1)


class MotorInsurance(Action):
    def __init__(self):
        self.faq_data = pd.read_csv(
            '/home/akash/backend/hackrx/rasa_f/motor_insurance.csv')

    def name(self):
        return 'actions.MotorInsurance'

    def run(self, dispatcher, tracker, domain):

        query = tracker.latest_message['text']

        # query['user']
        questions = self.faq_data['question'].values.tolist()

        # use process.extract(.. limits = 3) to get multiple close matches
        mathed_question, score = process.extractOne(
            query, questions, scorer=fuzz.token_set_ratio)
        row = 0
        if score > 50:  # arbitrarily chosen 50 to exclude matches not relevant to the query
            matched_row = self.faq_data.loc[self.faq_data['question']
                                            == mathed_question, ]
            match = matched_row['question'].values[0]
            answer = matched_row['answers'].values[0]
            row = matched_row['row'].values[0]

        else:
            response = "Sorry I couldn't find anything relevant to your query!"
            dispatcher.utter_message(response)

        if row >= 1 and row <= 3:
            response1 = requests.get(
                f"http://206.189.137.135:3000/insurance?type=Motor")
            if response1.status_code == 200:
                print("sucessfully fetched the data")
                dispatcher.utter_message(buttons=[
                    {"payload": "four wheel motor", "title": response1.json()[
                        'data'][0]['description']},
                    {"payload": "two wheel motor", "title": response1.json()[
                        'data'][1]['description']},
                ])
            else:
                response1 = "Hello person, there's a {response1.status_code} error with your request"
                dispatcher.utter_message(response1)
        else:
            bearer = 'Bearer '+str(userToken)
            headers = {'Authorization': bearer}
            response = requests.get(
                'http://206.189.137.135:3000/insurance/user', headers=headers)

            # url = 'http://206.189.137.135:3000/insurance/get'
            # payload = {'some': 'data'}
            # headers = {"Authorization": "Bearer MYREALLYLONGTOKENIGOT"}
            # r = requests.post(url, data=json.dumps(payload), headers=headers)response1 = requests.get(f"http://206.189.137.135:3000/insurance/get")

            if response1.status_code == 200:
                print("sucessfully fetched the data")
                response2 = (response1.json()['title'])
                # buttons = []
                # #append the response of API in the form of title and payload
                # buttons.append({'title': response1.json()['title'] , 'payload': "/qn"})
                # buttons.append({'title': response1.json()['completed'] , 'payload': "/qnapi"})
                # #then display it using dispatcher
                dispatcher.utter_message(buttons=[
                    {"payload": "/ml1", "title": response.json()['data']},
                    {"payload": "/ml2", "title": response.json()['data']},
                ])
            else:
                response1 = "Hello person, there's a {response1.status_code} error with your request"
                dispatcher.utter_message(response1)


class GetAnswer(Action):
    def __init__(self):
        self.faq_data = pd.read_csv(
            '/home/akash/backend/hackrx/rasa_f/faq_data.csv')

    def name(self):
        return 'actions.GetAnswer'

    def run(self, dispatcher, tracker, domain):
        query = tracker.latest_message['text']
        questions = self.faq_data['question'].values.tolist()

        # use process.extract(.. limits = 3) to get multiple close matches
        mathed_question, score = process.extractOne(
            query, questions, scorer=fuzz.token_set_ratio)

        if score > 50:  # arbitrarily chosen 50 to exclude matches not relevant to the query
            matched_row = self.faq_data.loc[self.faq_data['question']
                                            == mathed_question, ]
            document = matched_row['link'].values[0]
            page = matched_row['page'].values[0]
            match = matched_row['question'].values[0]
            answer = matched_row['answers'].values[0]
            response = "Here's something I found, \n\n Document: {} \n Page number: {} \n Question: {} \n Answer: {} \n".format(
                document, page, match, answer)

        else:
            response = "Sorry I couldn't find anything relevant to your query!"

        dispatcher.utter_message(response)

# class ApiAnswer(Action):
# 	def name(self):
# 		return 'actions.ApiAnswer'

# 	def run(self, dispatcher, tracker, domain):
# 		query =  tracker.latest_message
# 		print(query)
# 		response="Hello"
# 		response = requests.get(f"https://jsonplaceholder.typicode.com/todos/1")
# 		if response.status_code == 200:
# 			print("sucessfully fetched the data")
# 			print(str(response.json()))
# 		else:
# 			print(f"Hello person, there's a {response.status_code} error with your request")
# 		response1=(str(response.json()))
# 		dispatcher.utter_message(response1)


class Greet(Action):
    def name(self):
        return 'actions.Greet'

    def run(self, dispatcher, tracker, domain):
        global userToken
        query = tracker.latest_message['text']
        print(query)
        response = requests.get(
            f"http://206.189.137.135:3000/insurance/user-info", headers={"Authorization": "Bearer "+userToken})
        print(response.json())
        response1 = ""
        name = ""
        if response.status_code == 200:
            print("sucessfully fetched the data")
            name = response.json()['user']['name']
        response1 = "Hey " + name
        dispatcher.utter_message(response1)


class Buy(Action):
    print("Buy")

    def name(self):
        return 'actions.Buy'

    def run(self, dispatcher, tracker, domain):
        response1 = "Hello"
        query = tracker.latest_message['text']
        print(query)
        query = json.loads(query)
        # print(query)

        user = query['user']
        query = query['message']
        response = requests.get(
            'http://206.189.137.135:3000/user/'+user)

        if response.status_code == 200:
            response1 = "Hey "+response.json()['name']+" link is sent to your mail on "+response.json()[
                'email']+" and also on your mobile number "+response.json()['phone']
        else:
            print(
                f"Hello person, there's a {response.status_code} error with your request")
        # response1=(str(response.json()))
        dispatcher.utter_message(response1)


class Insurance(Action):
    print("Insurance")

    def name(self):
        return 'actions.Insurance'

    def run(self, dispatcher, tracker, domain):
        response1 = "Hello"
        dispatcher.utter_message(text="You may select one of the insurances", buttons=[
            {"payload": "buy health insurance", "title": "Health Insurance "},
            {"payload": "buy motor insurance", "title": "Motor Insurance "},
        ])


class PostClaimDesc(Action):
    # print("Desc")
    def __init__(self):
        self.faq_data = pd.read_csv(
            '/home/akash/backend/hackrx/rasa_f/reasons.csv')

    def name(self):
        return 'actions.PostClaimDesc'

    def run(self, dispatcher, tracker, domain):
        cause = tracker.get_slot("cause")
        description = tracker.get_slot("description")
        print("cause  is : ", cause)
        print("description is : ", description)
        url = "https://vehicle-damage-assessment.p.rapidapi.com/run"

        payload = {
            "draw_result": True,
            "image": "https://image.shutterstock.com/image-photo/accident-car-260nw-682388278.jpg"
        }
        headers = {
            "content-type": "application/json",
            "X-RapidAPI-Key": "bda1d0a9e0mshdf4bb9638279677p1943a0jsnab5af7d2478a",
            "X-RapidAPI-Host": "vehicle-damage-assessment.p.rapidapi.com"
        }

        response = requests.request("POST", url, json=payload, headers=headers)

        obj = json.loads(response.text)
        print(obj['output']['elements'][0])

        scratch = obj['output']['elements'][0]['damage_category']
        locn = obj['output']['elements'][0]['damage_location']
        score = int(obj['output']['elements'][0]['score'])+10

        dispatcher.utter_message("Claim recorded")
        return[AllSlotsReset()]


class PostHealthInsuDesc(Action):
    print("HealDesc")

    def name(self) -> Text:
        return "actions.PostHealthInsuDesc"

    def run(self, dispatcher, tracker, domain):
        global userToken
        name = tracker.get_slot("name")
        age = tracker.get_slot("age")
        print("cause  is : ", name)
        # print("description is : ",description)
        response = requests.get(
            f"http://206.189.137.135:3000/insurance?type=Health")
        response1 = ""
        if response.status_code == 200:
            print("sucessfully fetched the data")
            response1 = response.json()['data'][0]['_id']
        payload = {'name': name, 'age': age}
        pay = {"insurance_id": "62b737b614289b4c93806947", "payload": payload}
        headers = {"Authorization": "Bearer " + userToken}
        print(headers)
        resp = requests.request(
            "POST", "http://206.189.137.135:3000/insurance/buy", json=pay, headers=headers)
        print(resp.json())
        dispatcher.utter_message("Insurance Purchased")
        return[AllSlotsReset()]


class PostMotorFourDesc(Action):

    print("motorDesc")

    def name(self) -> Text:
        return "actions.PostMotorFourDesc"

    def run(self, dispatcher, tracker, domain):
        global userToken
        name = tracker.get_slot("name1")
        age = tracker.get_slot("age1")
        print("cause  is : ", name)
        # print("description is : ",description)
        response = requests.get(
            f"http://206.189.137.135:3000/insurance?type=Motor")
        response1 = ""
        if response.status_code == 200:
            print("sucessfully fetched the data")
            response1 = response.json()['data'][0]['_id']
        payload = {'type': name, 'miles': age}
        pay = {"insurance_id": "62b6d2dc14289b4c93806942", "payload": payload}
        headers = {"Authorization": "Bearer " + userToken}
        print(headers)
        resp = requests.request(
            "POST", "http://206.189.137.135:3000/insurance/buy", json=pay, headers=headers)
        print(resp.json())
        dispatcher.utter_message("Insurance Purchased")
        return[AllSlotsReset()]


class PostMotorTworDesc(Action):
    print("Motor 2")

    def name(self) -> Text:
        return "actions.PostMotorTwoDesc"

    def run(self, dispatcher, tracker, domain):
        global userToken
        name = tracker.get_slot("name2")
        age = tracker.get_slot("age2")

        print("cause  is : ", name)
        response = requests.get(
            f"http://206.189.137.135:3000/insurance?type=Motor")
        response1 = ""
        if response.status_code == 200:
            print("sucessfully fetched the data")
            response1 = response.json()['data'][1]['_id']
        # print("description is : ",description)
        # resp = requests.post(
        #     f"http://206.189.137.135:3000/insurance?")
        payload = {'type': name, 'miles': age}
        pay = {"insurance_id": "62b7375514289b4c93806944", "payload": payload}
        headers = {"Authorization": "Bearer " + userToken}
        print(headers)
        resp = requests.request(
            "POST", "http://206.189.137.135:3000/insurance/buy", json=pay, headers=headers)
        print(resp.json())
        dispatcher.utter_message("Insurance Purchased")
        return[AllSlotsReset()]
