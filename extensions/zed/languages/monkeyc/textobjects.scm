(function_declaration) @function.around
(function_declaration body: (block (_)* @function.inside))

(class_declaration) @class.around
(class_declaration body: (class_body (_)* @class.inside))

(comment)+ @comment.around
