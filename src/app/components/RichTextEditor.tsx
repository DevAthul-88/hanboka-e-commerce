import React, { useEffect, useRef, memo } from "react"
import { useField, useFormikContext } from "formik"
import { Editor } from "@tinymce/tinymce-react"

export interface RichTextEditorProps {
  name: string
  label?: string
  placeholder?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ name, label, placeholder }) => {
  const [field, meta, helpers] = useField(name)
  const { isSubmitting } = useFormikContext()
  const editorRef = useRef<any>(null)

  useEffect(() => {
    // You can set up any editor configurations here if necessary
    if (editorRef.current && field.value) {
      editorRef.current.setContent(field.value)
    }
  }, [field.value])

  const handleEditorChange = (content: string) => {
    helpers.setValue(content) // Update Formik value when content changes
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <Editor
        apiKey={process.env.TINYMC_KEY}
        licenseKey="gpl"
        value={field.value}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat",
          placeholder: placeholder || "Enter description...",
          readOnly: isSubmitting,
        }}
        onEditorChange={(_, editor) => handleEditorChange(editor.getContent())}
        onInit={(evt, editor) => (editorRef.current = editor)}
      />

      {meta.error && meta.touched && (
        <div role="alert" className="text-sm text-destructive">
          {meta.error}
        </div>
      )}
    </div>
  )
}

export default memo(RichTextEditor)
