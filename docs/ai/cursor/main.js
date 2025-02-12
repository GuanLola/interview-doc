// ByteBuddy: ByteBuddy的核心类,用于创建和修改Java类
import net.bytebuddy.ByteBuddy;

// DynamicType: 表示一个动态生成的类型,包含未加载的类定义
import net.bytebuddy.dynamic.DynamicType;

// FieldAccessor: 用于生成字段的访问器方法(getter/setter)
import net.bytebuddy.implementation.FieldAccessor;

// MethodDelegation: 用于方法委托,可以将方法调用委托给其他类处理
import net.bytebuddy.implementation.MethodDelegation;

public class ByteBuddyDemo {
    public static void main(String[] args) throws Exception {
        // 创建ByteBuddy实例用于生成类
        DynamicType.Unloaded<Object> dynamicType = new ByteBuddy()
            // 指定生成类继承自Object类
            .subclass(Object.class)
            // 设置生成类的全限定名
            .name("com.example.Student")
            // 定义name属性,会自动生成getter/setter方法
            .defineProperty("name", String.class)
            // 定义age属性,会自动生成getter/setter方法
            .defineProperty("age", int.class)
            // 生成类的字节码
            .make();

        // 使用类加载器加载生成的类
        Class<?> studentClass = dynamicType.load(ByteBuddyDemo.class.getClassLoader())
            .getLoaded();

        // 通过反射创建Student类的实例
        Object student = studentClass.getDeclaredConstructor().newInstance();

        // 通过反射调用setName方法设置name属性
        studentClass.getMethod("setName", String.class).invoke(student, "Tom");
        // 通过反射调用setAge方法设置age属性
        studentClass.getMethod("setAge", int.class).invoke(student, 18);

        // 通过反射调用getName方法获取name属性值
        String name = (String) studentClass.getMethod("getName").invoke(student);
        // 通过反射调用getAge方法获取age属性值
        int age = (int) studentClass.getMethod("getAge").invoke(student);

        // 打印属性值
        System.out.println("Student name: " + name);
        System.out.println("Student age: " + age);
    }
}

