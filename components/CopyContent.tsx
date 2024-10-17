import { useAppThemeContext } from "@/contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

export default function ContentCopy({ aoClicarEmCopy, value }: { value: string, aoClicarEmCopy: (value: string) => void }) {
    const [copied, setCopied] = useState(false);
    const { DefaultTheme } = useAppThemeContext();

    useEffect(() => {
        if (copied) {
            setTimeout(() => setCopied(false), 2000);
        }
    }, [copied]);

    const handleCopy = () => {
        setCopied(true);
        aoClicarEmCopy(value)
    }

    if (copied) {
        return (
            <TouchableOpacity >
                <MaterialIcons name="check" size={28} color={DefaultTheme.colors.primary} />
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity >
                <MaterialIcons name="content-copy" size={28} color={DefaultTheme.colors.primary} onPress={handleCopy} />
            </TouchableOpacity>
        );
    }

}