import {motion} from "framer-motion";

export default function Footer(){
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.5 }}
    className="bg-muted p-4 rounded-lg"
  >
    <h3 className="font-medium mb-2">About the Algorithms</h3>
    <ul className="space-y-2 text-sm text-muted-foreground">
      <li>
        <strong>Caesar Cipher:</strong> Shifts each letter by a fixed number of positions in the alphabet.
      </li>
      <li>
        <strong>Vigenère Cipher:</strong> Uses a keyword to determine the shift value for each letter.
      </li>
      <li>
        <strong>Base64:</strong> Encodes binary data into ASCII characters.
      </li>
      <li>
        <strong>Reverse Text:</strong> Simply reverses the order of characters.
      </li>
    </ul>
  </motion.div>
  )
}
