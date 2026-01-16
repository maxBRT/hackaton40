import {FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {NativeSelect, NativeSelectOption} from "@/components/ui/native-select.tsx";
import type {Course} from "@/types/Course";
import React, {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import type {ForumThread, NewForumThreadRequest, NewForumThreadResponse} from "@/types/Forum";
import api from "@/utils/axiosRequestInterceptor.ts";
import {handleApiError} from "@/utils/handleApiError.ts";

interface NewForumThreadFormProps {
    courses: Course[]
    onThreadCreated?: (newThread: ForumThread) => void;
}

const NewForumThreadForm: React.FC<NewForumThreadFormProps> = ({courses, onThreadCreated}) => {
    
    const [title, setTitle] = useState<string>("");
    const [courseId, setCourseId] = useState<string>(courses[0]?.id || "");
    const [content, setContent] = useState<string>("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const requestBody: NewForumThreadRequest = {title, content, courseId};
            console.log(requestBody);
            const response = await api.post<NewForumThreadResponse>(`/forum-threads/courses/${courseId}`, requestBody);
            const responseData = response.data
            if (responseData.success && onThreadCreated) {
                const newThread = responseData.data;
                onThreadCreated(newThread);
            } 
        } catch (error) {
            handleApiError(error, (error) => console.log(error))
        } finally {
            setTitle("");
            setContent("");
        }
    }
    
   return (
  <div className="relative w-full max-w-4xl mx-auto p-6 rounded-xl my-3 border shadow-sm">

    <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="md:col-span-2">
          <FieldGroup className="flex flex-col gap-1">
            <FieldLabel className="text-sm font-medium">Titre</FieldLabel>
            <Input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la question" 
              className="w-full p-2 border rounded-md"
            />
          </FieldGroup>
        </div>

        <div className="md:col-span-1">
          <FieldGroup className="flex flex-col gap-1">
            <FieldLabel className="text-sm font-medium">Cours</FieldLabel>
            <NativeSelect 
                className="w-full p-2 border rounded-md bg-transparent"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
            >
                <NativeSelectOption value="">Choisir un cours</NativeSelectOption>
              {courses.map((c: Course) => (
                <NativeSelectOption className="text-gray-600" key={c.id} value={c.id}>
                  {c.title}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FieldGroup>
        </div>
      </div>

      <FieldGroup className="flex flex-col gap-1">
        <FieldLabel className="text-sm font-medium">Contenu</FieldLabel>
        <textarea
          placeholder="Contenu de la question" 
          className="w-full h-32 p-2 border rounded-md resize-none align-top"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </FieldGroup>
        <Button type={"submit"}>Soumettre</Button>
    </form>
  </div>
)
}
export default NewForumThreadForm