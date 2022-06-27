import json
from rasa.shared.nlu.training_data.training_data import TrainingData
from rasa.shared.nlu.training_data.message import Message
from rasa.engine.storage.storage import ModelStorage
from rasa.engine.storage.resource import Resource
from rasa.engine.recipes.default_recipe import DefaultV1Recipe
from rasa.engine.graph import GraphComponent, ExecutionContext
from typing import Dict, Text, Any, List

import googletrans
from googletrans import Translator
translator = Translator()


lang = 'en'

# TODO: Correctly register your component with its type


@DefaultV1Recipe.register(
    [DefaultV1Recipe.ComponentType.MESSAGE_TOKENIZER], is_trainable=False
)
class Preprocess(GraphComponent):
    @classmethod
    def create(
        cls,
        config: Dict[Text, Any],
        model_storage: ModelStorage,
        resource: Resource,
        execution_context: ExecutionContext,
    ) -> GraphComponent:
        # TODO: Implement this
        ...

    def train(self, training_data: TrainingData) -> Resource:
        # TODO: Implement this if your component requires training
        ...

    def process_training_data(self, training_data: TrainingData) -> TrainingData:
        # TODO: Implement this if your component augments the training data with
        #       tokens or message features which are used by other components
        #       during training.
        ...

        return training_data

    def process(self, messages: List[Message]) -> List[Message]:
        # This method is used to modify the user message and remove the () if they are included in the user test.
        for message in messages:
            if 'text' in message.data.keys():
                msg = message.data['text']
                msg1 = translator.translate(msg)
                # global lang
                # lang=msg1.src
                message.data['text'] = msg1.text
        return messages

# @DefaultV1Recipe.register(
#     [DefaultV1Recipe.ComponentType.MESSAGE_TOKENIZER], is_trainable=False
# )
# class FinalResponse(GraphComponent):
#     @classmethod
#     def create(
#         cls,
#         config: Dict[Text, Any],
#         model_storage: ModelStorage,
#         resource: Resource,
#         execution_context: ExecutionContext,
#     ) -> GraphComponent:
#         # TODO: Implement this
#         ...

#     def train(self, training_data: TrainingData) -> Resource:
#         # TODO: Implement this if your component requires training
#         ...

#     def process_training_data(self, training_data: TrainingData) -> TrainingData:
#         # TODO: Implement this if your component augments the training data with
#         #       tokens or message features which are used by other components
#         #       during training.
#         ...

#         return training_data

#     def process(self, messages: List[Message]) -> List[Message]:
#         # This method is used to modify the user message and remove the () if they are included in the user test.
#         for message in messages:
#             if 'text' in message.data.keys():
#                 msg = message.data['text']
#                 global lang
#                 print(msg)
#                 print(lang)
#                 msg1=translator.translate(msg, dest=lang)
#                 #print(type(msg1.text))
#                 #print(type(msg))
#                 #print(msg1.text)
#                 message.data['text'] = msg1.text
#         return messages


# import typing
# from typing import Any, Optional, Text, Dict, List, Type
# from rasa.nlu.components import Component
# from rasa.nlu.config import RasaNLUModelConfig
# from rasa.nlu.training_data import Message, TrainingData
# from rasa.nlu.tokenizers.tokenizer import Token
# import googletrans
# from googletrans import Translator
# translator = Translator()


# if typing.TYPE_CHECKING:
#     from rasa.nlu.model import Metadata


# class Preprocess(Component):

#     @classmethod
#     def required_components(cls) -> List[Type[Component]]:
#         return []

#     defaults = {"alias": None}
#     language_list = None

#     def __init__(self, component_config: Optional[Dict[Text, Any]] = None) -> None:
#         super().__init__(component_config)

#     def train(
#         self,
#         training_data: TrainingData,
#         config: Optional[RasaNLUModelConfig] = None,
#         **kwargs: Any,
#     ) -> None:
#         pass

#     def process(self, messages: List[Message]) -> List[Message]:
#         # This method is used to modify the user message and remove the () if they are included in the user test.
#         for message in messages:
#             if 'text' in message.data.keys():
#                 msg = message.data['text']
#                 msg1=translator.translate(msg)
#                 message.data['text'] = msg1.text
#         return messages


#     def persist(self, file_name: Text, model_dir: Text) -> Optional[Dict[Text, Any]]:
#         pass

#     @classmethod
#     def load(
#         cls,
#         meta: Dict[Text, Any],
#         model_dir: Optional[Text] = None,
#         model_metadata: Optional["Metadata"] = None,
#         cached_component: Optional["Component"] = None,
#         **kwargs: Any,
#     ) -> "Component":
#         """Load this component from file."""

#         if cached_component:
#             return cached_component
#         else:
#             return cls(meta)
